const toDoForm = document.getElementById("todo-form");
const toDoInput = document.querySelector("#todo-form input")
const toDoList = document.getElementById("todo-list");

const TODOS_KEY = "todos";

let toDos = [];

function saveToDos(){  // toDos에 저장된 값을 localStorage에 저장하는 함수
    localStorage.setItem("todos", JSON.stringify(toDos));
}

function deleteToDo(event){

    // console.log(event);
    // console.log(event.target);  // 버튼에서 발생한 이벤트의 타겟 출력
    // console.dir(event.target);  // 클릭 이벤트 발생 버튼의 정보 출력
    
    // console.log(event.target.parentElement);
    // 클릭 이벤트를 발생시킨 버튼의 부모, 즉 해당 버튼을 포함하고 있는
    // 상위 태그가 무엇인지 출력함

    const delLi = event.target.parentElement;  // 클릭된 버튼의 객체를 delLi에 저장
    delLi.remove();  // 해당 값을 삭제

    // console.log(delLi.id);  // 삭제하는 <li>의 id값을 출력할 수 있음
    // console.log(typeof delLi.id);  // 삭제하는 항목의 id 타입이 string임을 알 수 있음
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(delLi.id));  // 둘의 타입을 맞춰줌
    saveToDos();  // 변경사항을 localStorage에 다시 저장!
    
}

function paintToDo(newTodo){  // input에 입력한 값을 화면상에 추가해줌
    // console.log("i will paint", newTodo);
    const patata = document.createElement("li");  // <li> 태그 생성

    patata.id = newTodo.id;  // <li>의 id 값을 newTodo의 id(이름) 값으로 설정

    const span = document.createElement("span");  // <span> 생성

    span.innerText = newTodo.text;  // <span>값을 newTodo의 text값으로 설정

    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", deleteToDo);
    patata.appendChild(delBtn);
    patata.appendChild(span);  // <li>내부에 <span> 추가
    
    
    // console.log(patata);

    toDoList.appendChild(patata); // html의 <ul>에 값을 추가!
}

function handleToDoSubmit(event){  // input에 입력한 값일 화면에 출력 & toDos에 추가 & localStorage에 저장 하는 함수 호출
    event.preventDefault();  // 새로고침 막기
    // console.log(toDoInput.value);
    const newTodo = toDoInput.value;  // input에 있는 값 가져오기
    toDoInput.value = "";  // input 비우기

    const newTodoObj = {
        text:newTodo,
        id : Date.now(),
    };

    toDos.push(newTodoObj);
    paintToDo(newTodoObj);  // paintTodo에 newTodo 값을 전달하며 호출
    saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);


function sayHello(item){  // event처럼 어느것인지 알려줌!
    console.log("this is the turn of", item);
}

const savedToDos = localStorage.getItem(TODOS_KEY);

if(savedToDos !== null){
    const parsedToDos = JSON.parse(savedToDos);
    // parsedToDos.forEach(sayHello);
    // parsedToDos.forEach((item) => console.log("this is the turn of ", item));

    toDos = parsedToDos;

    parsedToDos.forEach(paintToDo);  // loacal Storage에 저장된 값을 paintToDo를 사용하여 화면에 출력하기
}

// array에서 지우고 싶은 item을 제외한 item으로 새로운 array를 만든다!

