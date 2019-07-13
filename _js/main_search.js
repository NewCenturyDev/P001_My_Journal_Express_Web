var login = document.getElementById('login');
var register = document.getElementById('register');

function logIn() {
    location.href = "login.html";
}

function signUp() {
    location.href = "register.html";
}

login.addEventListener("click", logIn);
register.addEventListener("click", signUp);