import { GestureRecognizer, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let gestureRecognizer;
let webcamElement = document.getElementById("webcam");
let results;
let particles = [];
let handData = [
    { x: 0, y: 0, vx: 0, vy: 0, lastCategory: "None", burstCooldown: 0, chargeTime: 0 },
    { x: 0, y: 0, vx: 0, vy: 0, lastCategory: "None", burstCooldown: 0, chargeTime: 0 }
];
let prayTimeCounter = 0;

// [1. AI 초기화 및 카메라 설정]
async function setupAI() {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
    });
    startCamera();
}

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        webcamElement.srcObject = stream;
        webcamElement.addEventListener("loadeddata", predict);
    });
}

async function predict() {
    if (gestureRecognizer) {
        results = gestureRecognizer.recognizeForVideo(webcamElement, Date.now());
    }
    requestAnimationFrame(predict);
}

window.setup = () => {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);
    for (let i = 0; i < 800; i++) particles.push(new Particle());
    setupAI();
};

window.draw = () => {
    background(0, 0, 0, 25);

    if (!results || !results.landmarks || results.landmarks.length === 0) {
        particles.forEach(p => { p.idle(); p.update(); p.display(); });
        prayTimeCounter = 0;
        return;
    }

    // 2. 손 데이터 업데이트 및 차징 로직
    results.landmarks.forEach((landmarks, hIndex) => {
        let h = handData[hIndex];
        if (!h) return;
        let newX = (1 - landmarks[9].x) * width;
        let newY = landmarks[9].y * height;
        h.vx = newX - h.x; h.vy = newY - h.y;
        h.x = newX; h.y = newY;

        let category = results.gestures[hIndex] ? results.gestures[hIndex][0].categoryName : "None";
        
        // 차징 시스템: 주먹을 쥐고 있으면 chargeTime 증가
        if (category === "Closed_Fist") {
            h.chargeTime = min(h.chargeTime + 1, 150); // 최대 2.5초 차징
        }

        // 폭발 트리거: 주먹 -> 보자기
        if (h.lastCategory === "Closed_Fist" && category === "Open_Palm") {
            h.burstCooldown = 20;
        }

        h.lastCategory = category;
        if (h.burstCooldown > 0) h.burstCooldown--;
    });

    // 3. 제스처 모드 판정
    let mode = "follow";
    let lm = results.landmarks;
    if (lm.length === 2) {
        if (isSquare(lm)) { mode = "square"; prayTimeCounter = 0; }
        else if (isPraying(lm)) { mode = "flower"; prayTimeCounter++; }
        else if (isHeart(lm)) { mode = "heart"; prayTimeCounter = 0; }
        else { prayTimeCounter = 0; }
    } else {
        prayTimeCounter = 0;
    }

    // 4. 파티클 실행 및 업데이트
    let pPerHand = Math.floor(particles.length / lm.length);
    particles.forEach((p, i) => {
        let hIndex = floor(i / pPerHand);
        if (hIndex >= lm.length) hIndex = lm.length - 1;
        let h = handData[hIndex];

        if (mode === "flower") p.flowerMode(prayTimeCounter);
        else if (mode === "heart") p.heartMode();
        else if (mode === "square") p.squareMode();
        else p.followMode(h);

        p.update();
        p.display();
    });

    // 5. 폭발 연산 직후 차징 시간 초기화 (모든 파티클이 힘을 받은 뒤)
    handData.forEach(h => {
        if (h.burstCooldown === 18) h.chargeTime = 0; 
    });
};

// [인식 로직 개선: 합장 vs 하트]
function isPraying(lm) {
    let palmDist = dist(lm[0][9].x, lm[0][9].y, lm[1][9].x, lm[1][9].y);
    let dRootToTip = dist(lm[0][5].x, lm[0][5].y, lm[0][8].x, lm[0][8].y);
    let dJoints = dist(lm[0][5].x, lm[0][5].y, lm[0][6].x, lm[0][6].y) + dist(lm[0][6].x, lm[0][6].y, lm[0][8].x, lm[0][8].y);
    let straightness = dRootToTip / dJoints;
    return palmDist < 0.22 && straightness > 0.95; // 꼿꼿해야 합장
}

function isHeart(lm) {
    let tipDist = dist(lm[0][8].x, lm[0][8].y, lm[1][8].x, lm[1][8].y);
    let palmDist = dist(lm[0][9].x, lm[0][9].y, lm[1][9].x, lm[1][9].y);
    let dRootToTip = dist(lm[0][5].x, lm[0][5].y, lm[0][8].x, lm[0][8].y);
    let dJoints = dist(lm[0][5].x, lm[0][5].y, lm[0][6].x, lm[0][6].y) + dist(lm[0][6].x, lm[0][6].y, lm[0][8].x, lm[0][8].y);
    let straightness = dRootToTip / dJoints;
    return tipDist < 0.1 && palmDist > 0.22 && straightness < 0.9; // 구부러져야 하트
}

function isSquare(lm) {
    let d1 = dist(lm[0][8].x, lm[0][8].y, lm[1][4].x, lm[1][4].y);
    let d2 = dist(lm[0][4].x, lm[0][4].y, lm[1][8].x, lm[1][8].y);
    return d1 < 0.08 && d2 < 0.08;
}

// [파티클 클래스: 차징 및 중앙 고정 반영]
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);
        this.maxSpeed = 15;
        this.col = color(0, 0, 100);
        this.isBursting = false;
        this.burstDelay = 0;
    }

    applyForce(f) { this.acc.add(f); }

    followMode(h) {
        let handPos = createVector(h.x, h.y);
        let d = p5.Vector.dist(this.pos, handPos);

        if (h.burstCooldown === 19) {
            let diff = p5.Vector.sub(this.pos, handPos);
            // 차징 보너스: 최소 1배 ~ 최대 3.5배
            let chargeMult = map(h.chargeTime, 0, 150, 1, 3.5);
            diff.setMag(random(60, 90) * chargeMult); 
            this.vel = diff;
            this.isBursting = true;
            this.burstDelay = 60 + (h.chargeTime / 2); // 많이 모을수록 여운이 김
        }

        if (h.lastCategory === "Closed_Fist") {
            this.burstDelay = 0;
            // 차징 시 떨림 효과
            let vib = map(h.chargeTime, 0, 150, 0, 12);
            this.applyForce(p5.Vector.random2D().mult(vib));
            // 차징 색상: 노란색/흰색 계열로 변화
            this.col = color(map(h.chargeTime, 0, 150, 60, 40), 90, 100);

            let desired = p5.Vector.sub(handPos, this.pos);
            desired.setMag(map(d, 0, 800, 35, 10));
            this.applyForce(p5.Vector.sub(desired, this.vel));
        } else if (this.burstDelay > 0) {
            this.col = color(0, 0, 100);
        } else {
            this.col = color(0, 0, 100);
            let desired = p5.Vector.sub(handPos, this.pos);
            desired.setMag(65 / (d + 1));
            this.applyForce(desired);
        }
    }

    flowerMode(time) {
        this.burstDelay = 0;
        let i = particles.indexOf(this);
        let growth = map(min(time, 400), 0, 400, 0.5, 1.3);
        let baseR = height * 0.4 * growth;
        let target;

        if (i < particles.length / 2) {
            let t = frameCount * 0.02 + i * 0.05;
            target = createVector(width/2 + baseR * 0.6 * cos(t), height/2 + baseR * 0.6 * sin(t));
            this.col = color(200, 80, 100);
        } else {
            let t = frameCount * -0.015 + i * 0.05;
            let r = baseR * cos(6 * t);
            target = createVector(width/2 + r * cos(t), height/2 + r * sin(t));
            this.col = color((time % 360), 70, 100);
        }
        let desired = p5.Vector.sub(target, this.pos);
        desired.setMag(16);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(3);
        this.applyForce(steer);
    }

    heartMode() {
        this.burstDelay = 0;
        let i = particles.indexOf(this);
        let t = map(i, 0, particles.length, 0, TWO_PI);
        let s = height * 0.018;
        let x = 16 * pow(sin(t), 3);
        let y = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);
        let midX = ((1-results.landmarks[0][9].x)+(1-results.landmarks[1][9].x))/2*width;
        let midY = (results.landmarks[0][9].y+results.landmarks[1][9].y)/2*height;
        let target = createVector(midX + x * s, midY - y * s);
        let desired = p5.Vector.sub(target, this.pos);
        desired.setMag(14);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(2);
        this.applyForce(steer);
        this.col = color(345, 85, 100);
    }

    squareMode() {
        this.burstDelay = 0;
        let i = particles.indexOf(this);
        let side = floor(i / (particles.length / 4));
        let segmentT = (i % (particles.length / 4)) / (particles.length / 4);
        let size = height * 0.22;
        let tx, ty;
        if (side === 0) { tx = lerp(-size, size, segmentT); ty = -size; }
        else if (side === 1) { tx = size; ty = lerp(-size, size, segmentT); }
        else if (side === 2) { tx = lerp(size, -size, segmentT); ty = size; }
        else { tx = -size; ty = lerp(size, -size, segmentT); }
        let midX = ((1-results.landmarks[0][9].x)+(1-results.landmarks[1][9].x))/2*width;
        let midY = (results.landmarks[0][9].y+results.landmarks[1][9].y)/2*height;
        let target = createVector(midX + tx, midY + ty);
        let desired = p5.Vector.sub(target, this.pos);
        desired.setMag(14);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(2);
        this.applyForce(steer);
        this.col = color(190, 80, 100);
    }

    idle() { this.col = color(240, 80, 100, 50); this.vel.mult(0.95); }

    update() {
        this.vel.add(this.acc);
        let currentMax = this.isBursting ? 85 : this.maxSpeed;
        this.vel.limit(currentMax);
        this.pos.add(this.vel);
        this.acc.mult(0);
        let frict = this.isBursting ? 0.97 : 0.93;
        this.vel.mult(frict);
        if (this.vel.mag() < 12) this.isBursting = false;
        if (this.burstDelay > 0) this.burstDelay--;
        if (this.pos.x < 0 || this.pos.x > width) { this.vel.x *= -1; this.pos.x = constrain(this.pos.x, 0, width); }
        if (this.pos.y < 0 || this.pos.y > height) { this.vel.y *= -1; this.pos.y = constrain(this.pos.y, 0, height); }
    }

    display() { noStroke(); fill(this.col); ellipse(this.pos.x, this.pos.y, 6); }
}