var profile = document.getElementById('profile');
var logout = document.getElementById('logout');
var people = document.getElementById('people');
var mini_profile = document.getElementById('mini_profile');
var upload = document.getElementById('upload');

/* 사진 등록 위한 모달 및 버튼 */
var add_modal = document.getElementById('modal_bg');
var add = document.getElementById('add');
var r_c = document.getElementsByClassName("r_c");
var add_num = document.getElementById('add_num');
var modalcomeout = document.getElementById('modalcomeout');
var room_num = document.getElementById('room_num');

add_num.value = room_num.value;

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

/* 사진 등록 모달 띄우기 및 닫기*/
function addPhoto() {
  add_modal.style.display = 'flex';
}

function closeMsg() {
  add_modal.style.display = 'none';
}

function change_room_num() {
  room_num.value = this.value;
  add_num.value = this.value;
}

function move_and_stop() {
  if (this.value === 'stop') {
    $(".user_photo").on("click", move_photo());
    this.value = 'move';
  }
  else if (this.value === 'move') {
    $(".user_photo").off();
    this.value = 'stop';
  }
  alert(this.value+'모드로 변경 됨');
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

  function move_photo() {
    $(".user_photo").draggable( {
      cursor: "pointer",
      containment: "main"
    });
  }


profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);
people.addEventListener("click", goPeople);

for (var i = 0; i < r_c.length; i++) {
  r_c[i].addEventListener("click", change_room_num);
}

add.addEventListener("click", addPhoto);
modalcomeout.addEventListener("click", closeMsg);
upload.addEventListener("click", move_and_stop); // 사진 등록 기능 router로 이동