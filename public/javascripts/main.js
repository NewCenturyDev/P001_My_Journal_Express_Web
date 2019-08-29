var login = document.getElementById('login');
var register = document.getElementById('register');
var popular = document.getElementsByClassName("popular");

var block = document.getElementsByClassName("block");

function logIn() {
    location.href = "/login";
}

function signUp() {
    location.href = "/register";
}

// main block에 커서 올리면 글자색 변함
$(function(){
    $('.block').mouseenter(function() {
        ($(this).children('.mini_title')).css('color', 'rgb(43, 83, 193)');
    });
    $('.block').mouseleave(function() {
        ($(this).children('.mini_title')).css('color', 'black');
    });
});

// function go_contents() {
//     var id = ($(this).children('.id')).val();
//     var num = ($(this).children('.num')).val();
//     $('#id').val(id);
//     $('#num').val(num);
//     // alert(id+'\n'+num+'으로 이동하기');
//     $('#go_cont').submit();
// }

login.addEventListener("click", logIn);
register.addEventListener("click", signUp);

// for (var i = 0; i < block.length; i++) {
//     block[i].addEventListener("click", go_contents);
// }