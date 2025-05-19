const todoBar = document.getElementById("todo-bar");
const todoOpen = document.getElementById("todo-open");
const todoClose = document.getElementById("todo-close");

// <--북마크 바--> : 페이지 처음 접속 상황을 조절
const isTodoBarOpen = localStorage.getItem("isTodoBarOpen");
if (isTodoBarOpen === "close") {
    // localstorage에 isBookMarkBarOpen이 close라면
    todoBar.style.display = "none";
    todoOpen.style.display = "none";
    todoClose.style.display = "flex";
} else {
    //localstorage에 isBookMarkBarOpen이 open이라면 OR localstorage에 isBookMarkBarOpen이 없다면
    todoBar.style.display = "block";
    todoOpen.style.display = "flex";
    todoClose.style.display = "none";
}

// <--북마크 바 toggle--> : 페이지 로딩 이후의 상황을 조절
const TodoBarToggle = () => {
    let isTodoBarOpen = localStorage.getItem("isTodoBarOpen");
    
    if (isTodoBarOpen === "close") {
        localStorage.setItem("isTodoBarOpen", "open");  // 열려 있는 상태임을 저장
        todoBar.style.display = "block";
        todoOpen.style.display = "flex";
        todoClose.style.display = "none";
        return;
    }

    localStorage.setItem("isTodoBarOpen", "close"); // 닫혀 있는 상태임을 저장
    todoBar.style.display = "none";
    todoOpen.style.display = "none";
    todoClose.style.display = "flex";
};


document.getElementById("todo-open-btn").addEventListener("click", TodoBarToggle);
document.getElementById("todo-close-btn").addEventListener("click", TodoBarToggle);