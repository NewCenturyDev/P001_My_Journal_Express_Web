/* 상단 메뉴 변수 */
var login = document.getElementById('login');
var register = document.getElementById('register');

/* 회원 및 컨텐츠 표시하는 block */
var block = document.getElementsByClassName("block");

/* 상단 메뉴 페이지 이동 함수 */
function logIn() {
    location.href = "/login";
}
function signUp() {
    location.href = "/register";
}

/* main block에 커서 올리면 글자색 변함 */
$(function(){
    $('.block').mouseenter(function() {
        ($(this).children('.mini_title')).css('color', 'rgb(43, 83, 193)');
    });
    $('.block').mouseleave(function() {
        ($(this).children('.mini_title')).css('color', 'black');
    });
});

/* 컨텐츠 클릭 시 해당 회원의 page로 이동 */
function go_contents() {
    var id = ($(this).children('.id')).val();
    var num = ($(this).children('.num')).val();
    $('#id').val(id);
    $('#num').val(num);
    $('#go_cont').submit();
}

/* 클릭 시 스크롤 top 으로 올려줌 */
$('#backtotop').click(function() {
    $('html, body').animate({scrollTop: 0}, 400);
    return false;
});

/* 이벤트 등록 */
login.addEventListener("click", logIn);
register.addEventListener("click", signUp);

for (var i = 0; i < block.length; i++) {
    block[i].addEventListener("click", go_contents);
}