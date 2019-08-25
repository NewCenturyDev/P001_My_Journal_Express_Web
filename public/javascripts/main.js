var login = document.getElementById('login');
var register = document.getElementById('register');
var popular = document.getElementsByClassName("popular");

// for (var i = 0; i < popular.length; i++) {
//     if ( (i%2)!=0 ) {
//         popular[i].style.background = '#F6F6F6';
//     }
// }

function logIn() {
    location.href = "/login";
}

function signUp() {
    location.href = "/register";
}


login.addEventListener("click", logIn);
register.addEventListener("click", signUp);