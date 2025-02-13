const images = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg"
];

const chosenImage = images[Math.floor(Math.random() * images.length)];

// console.log(chosenImage);

const bgImage = document.createElement("img");
bgImage.src = `img/${chosenImage}`;
bgImage.setAttribute("width", "100%");
bgImage.setAttribute("height", "100%");

// console.log(bgImage);

// document.body.appendChild(bgImage);

// 배경 이미지로 설정
const bgImageUrl = bgImage.src; // 이미지 URL만 추출

console.log("Chosen background image URL:", bgImageUrl); // 추출된 URL 확인

// body에 배경 이미지 설정
document.body.style.backgroundImage = `url(${bgImageUrl})`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";


