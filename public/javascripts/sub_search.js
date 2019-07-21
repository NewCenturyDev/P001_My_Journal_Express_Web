var profile = document.getElementById('profile');
var logout = document.getElementById('logout');
var people = document.getElementById('people');
var send = document.getElementById('send');
var plettle = document.getElementsByClassName("plettle")[0];
var modalcomeout = document.getElementsByClassName("modalcomeout")[0];

function goProfile() {
    location.href = "/profile";
}
function logOut() {
    alert('로그아웃 되었습니다!');
    location.href = "/";
}
function goPeople() {
    location.href = "/search";
}

function sendMsg() {
    plettle.style.display = 'flex';
}
function closeMsg() {
    plettle.style.display = 'none';
}

profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);
people.addEventListener("click", goPeople);

send.addEventListener("click", sendMsg);
modalcomeout.addEventListener("click", closeMsg);