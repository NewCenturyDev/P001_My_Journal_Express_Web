var profile = document.getElementById('profile');
var logout = document.getElementById('logout');
var people = document.getElementById('people');
var mini_profile = document.getElementById('mini_profile');
var upload = document.getElementById('upload');

/* 사진 등록 위한 모달 및 버튼 */
var add_modal = document.getElementById('modal_bg');
var add = document.getElementById('add');
var modalcomeout = document.getElementById('modalcomeout');

/* 메뉴에 맞는 페이지로 이동 및 기능 */
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
} // 사진 등록 기능 router로 이동

/* 사진 등록 모달 띄우기 및 닫기*/
function addPhoto() {
  add_modal.style.display = 'flex';
}

function closeMsg() {
  add_modal.style.display = 'none';
}

/* 로그인 했을 시 미니 프로필 띄우기 */
if (add.value != "") {
  $(function(){
    $('#profile').mouseenter(function(){
      $('#mini_profile').css('display', 'grid');
    });
    $('#profile').mouseleave(function(){
      $('#mini_profile').css('display', 'none');
    });
  });
}

profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);
people.addEventListener("click", goPeople);


add.addEventListener("click", addPhoto);
modalcomeout.addEventListener("click", closeMsg);
upload.addEventListener("click", goUpload); // 사진 등록 기능 router로 이동