function onGeoOk(position){
    // console.log(position);  // 사용자의 위치 정보를 출력

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    console.log("You live in", lat, lng);

    // 숫자 좌표를 문자로 변형 해야함.
}
function onGeoError(){
    alert("Can't find you. No weather for you.");
}


navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);


