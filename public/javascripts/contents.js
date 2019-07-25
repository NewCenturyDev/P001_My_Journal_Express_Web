var profile = document.getElementById('profile');
var logout = document.getElementById('logout');
var people = document.getElementById('people');
var mini_profile = document.getElementById('mini_profile');
var upload = document.getElementById('upload');

function goProfile() {
    location.href = "/profile";
}
function logOut() {
    alert('로그아웃 되었습니다!');
    location.href = "/logout";
}
function goPeople() {
    location.href = "/search";
}
function goUpload() {
    location.href = "/file/upload";
}

$(function(){
  $('#profile').mouseenter(function(){
    $('#mini_profile').css('display', 'grid');
  });
  $('#profile').mouseleave(function(){
    $('#mini_profile').css('display', 'none');
  });
});

profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);
people.addEventListener("click", goPeople);
upload.addEventListener("click", goUpload);