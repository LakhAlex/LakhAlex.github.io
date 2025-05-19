const newTodoForm = document.getElementById("todo-item-input-form");
const todoItemList = document.getElementById("todo-list");

// <--북마크 리스트 초기 설정-->
let todoList = [];
localStorage.getItem("todoList")
    ? (todoList = JSON.parse(localStorage.getItem("todoList")))
    : localStorage.setItem("todoList", JSON.stringify(todoList));

// <--북마크 아이템 추가 버튼 초기 설정-->
let isAddBtnClick_Todo = false;
newTodoForm.style.display = "none";

// <--북마크 아이템 추가 버튼 Toggle-->
const newTodoToggle = () => {
    isAddBtnClick_Todo = !isAddBtnClick_Todo;
    isAddBtnClick_Todo ? (newTodoForm.style.display = "block") : (newTodoForm.style.display = "none");
};

// <--북마크 아이템 삭제-->
const deleteTodoItem = (id) => {
    const isDelete = window.confirm("정말 삭제하시겠습니까?");
    if (isDelete) {
        let todoList = JSON.parse(localStorage.getItem("todoList"));
        let nowTodoList = todoList.filter((elm) => elm.createAt !== id);
        localStorage.setItem("todoList", JSON.stringify(nowTodoList));
        document.getElementById(`todo-item-${id}`).remove();
        return;
    }
};

//<--북마크 아이템 나타내기-->
const setTodoItem = (item) => {
    const todoItem = document.createElement("div"); // div를 생성 : 메모리상에만
    todoItem.classList.add("todo-item"); // <div class="bookmark-item">을 추가!
    todoItem.id = `todo-item-${item.createAt}`; // <div class="" id="bookmark-item-${item.createAt}">
    // bookmarkItem.id는 추후 북마크를 삭제를 할 때 각각의 북마크를 구분하기 위함

    // const todoInfo = document.createElement("div");
    // todoInfo.classList.add("todo-info");

    const todoElement = document.createElement("div");
    todoElement.classList.add("todo-li");  // add()값은 마음대로 정해도 okay
    todoElement.textContent = item.todo;

    const todoDelBtn = document.createElement("div");
    todoDelBtn.classList.add("del-btn");
    todoDelBtn.textContent = "삭제";

    // 🔥 삭제 버튼 이벤트 등록
    todoDelBtn.addEventListener("click", () => {
        deleteTodoItem(item.createAt);
    });


    // 만들어진 각 정보를 bookmarkItem에 추가한다는 것!
    // todoItem.appendChild(todoInfo);
    todoItem.appendChild(todoElement);
    todoItem.appendChild(todoDelBtn);

    // 추가된 bookmarkItem은 이제 실제 화면상에 보여질 수 있도록 ItemList에 추가됨
    todoItemList.appendChild(todoItem);
};

// <!-- 북마크 리스트 요소 꺼내기 -->
const setTodoList = () => {
    todoList.forEach((item) => {
        setTodoItem(item);
    });
};

// <--북마크 아이템 추가-->
const addTodoItem = () => {
    let todoList = [];

    if(localStorage.getItem("todoList")){
        todoList = JSON.parse(localStorage.getItem("todoList"));
    }
    let todo = document.getElementById("new-todo-name-input").value;
    let createAt = Date.now();
    
    todoList.push({todo : todo, createAt : createAt});
    localStorage.setItem("todoList", JSON.stringify(todoList));

    document.getElementById("new-todo-name-input").value = "";

    newTodoToggle();
    setTodoItem({todo : todo, createAt : createAt});
}

setTodoList();
document.getElementById("todo-item-add-btn").addEventListener("click", newTodoToggle);
document.getElementById("todo-add-btn").addEventListener("click", addTodoItem);
document.getElementById("new-todo-name-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && document.getElementById("new-todo-name-input").value) {
        document.getElementById("todo-add-btn").click(); // 추가 버튼 클릭 이벤트 실행
    }
});
document.getElementById("todo-cancel-btn").addEventListener("click", newTodoToggle);