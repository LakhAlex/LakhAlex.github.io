const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");

const toDoLists = document.querySelector("#divFormAndUl");

const link = document.querySelector("a");

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "userName";

function onLoginSubmit(tomate) {
    // tomate.preventDefault();
    loginForm.classList.add(HIDDEN_CLASSNAME);
    const userNameThattheUserWrote = loginInput.value;
    localStorage.setItem(USERNAME_KEY, userNameThattheUserWrote);
    printGreetings(userNameThattheUserWrote);
}

function printGreetings(userName){
    greeting.innerText = `Hello ${userName}`;
    greeting.classList.remove(HIDDEN_CLASSNAME);
}


const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername === null){  // localStorage에 아무 것도 없을 경우
    // show the form
    loginForm.classList.remove(HIDDEN_CLASSNAME);  // form을 표시함
    loginForm.addEventListener("submit", onLoginSubmit);
    // 이벤트가 발생하기를 기다림
    // submit 이벤트가 발생하면 -> inLoginSubmit이라는 함수를 실행함
}else{
    // show the greetings
    toDoLists.classList.remove(HIDDEN_CLASSNAME);
    printGreetings(savedUsername);
}
