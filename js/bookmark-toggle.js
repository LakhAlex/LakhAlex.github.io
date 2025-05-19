const bookmarkBar = document.getElementById("bookmark-bar");
const bookMarkOpen = document.getElementById("bookmark-open");
const bookMarkClose = document.getElementById("bookmark-close");

// <--북마크 바--> : 페이지 처음 접속 상황을 조절
const isBookMarkBarOpen = localStorage.getItem("isBookMarkBarOpen");
if (isBookMarkBarOpen === "close") {
    // localstorage에 isBookMarkBarOpen이 close라면
    bookmarkBar.style.display = "none";
    bookMarkOpen.style.display = "none";
    bookMarkClose.style.display = "flex";
} else {
    //localstorage에 isBookMarkBarOpen이 open이라면 OR localstorage에 isBookMarkBarOpen이 없다면
    bookmarkBar.style.display = "block";
    bookMarkOpen.style.display = "flex";
    bookMarkClose.style.display = "none";
}

// <--북마크 바 toggle--> : 페이지 로딩 이후의 상황을 조절
const bookmarkBarToggle = () => {
    let isBookMarkBarOpen = localStorage.getItem("isBookMarkBarOpen");
    
    if (isBookMarkBarOpen === "close") {
        localStorage.setItem("isBookMarkBarOpen", "open");  // 열려 있는 상태임을 저장
        bookmarkBar.style.display = "block";
        bookMarkOpen.style.display = "flex";
        bookMarkClose.style.display = "none";
        return;
    }

    localStorage.setItem("isBookMarkBarOpen", "close"); // 닫혀 있는 상태임을 저장
    bookmarkBar.style.display = "none";
    bookMarkOpen.style.display = "none";
    bookMarkClose.style.display = "flex";
};


document.getElementById("bookmark-open-btn").addEventListener("click", bookmarkBarToggle);
document.getElementById("bookmark-close-btn").addEventListener("click", bookmarkBarToggle);