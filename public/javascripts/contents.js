var profile = document.getElementById('profile');
var logout = document.getElementById('logout');
var people = document.getElementById('people');
var mini_profile = document.getElementById('mini_profile');
var upload = document.getElementById('upload');

/* 사진 등록 위한 모달 및 버튼 */
var add_modal = document.getElementById('modal_bg');
var edit_modal = document.getElementById('modal_bg2');
var add = document.getElementById('add');
var r_c = document.getElementsByClassName("r_c");
var add_num = document.getElementById('add_num');
var modalcomeout = document.getElementsByClassName("modalcomeout");
var room_num = document.getElementById('room_num');

/* 사용자가 등록한 사진 관련 객체 */
var user_photo = document.getElementsByClassName("user_photo");
var photos_x_pos = document.getElementById("photos_x_pos");
var photos_y_pos = document.getElementById("photos_y_pos");
var edit = document.getElementById('edit'); // 객체 정보 보낼 form ID

/* 좌표에 맞는 사진을 대응 시키기 위한 사진 이름 */
var photos_name = document.getElementById("photos_name");
var photo_name = document.getElementsByClassName("photo_name");

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
  if (add_modal.style.display === 'flex') {
    add_modal.style.display = 'none';
  }
  if (edit_modal.style.display === 'flex') {
    edit_modal.style.display = 'none';
  }
}

function change_room_num() {
  room_num.value = this.value;
  add_num.value = this.value;
}

var photo_name_arr = new Array();
var photo_x_pos = new Array();
var photo_y_pos = new Array();

/* 편집한 사진 정보를 저장해 POST로 넘김 */
function move_and_stop() {
  if (this.value === 'stop') {
    $(".user_photo").on("click", move_photo());
    alert("편집 모드입니다. 마우스를 이용해 사진의 위치를 수정해주세요!")
    this.value = 'move';
  }
  else if (this.value === 'move') {
    for (var i = 0; i < user_photo.length; i++) {
      var x_pos = ($(".user_photo").eq(i)).offset().left;
      var y_pos = ($(".user_photo").eq(i)).offset().top;
      // 사진 좌표 및 크기 저장

      photo_x_pos[i] = x_pos;
      photo_y_pos[i] = y_pos;
      photo_name_arr[i] = photo_name[i].value;
    }
    photos_x_pos.value = photo_x_pos;
    photos_y_pos.value = photo_y_pos;

    photos_name.value = photo_name_arr;
    // 저장한 정보를 POST editPhoto로 넘김
    edit.submit();
  }
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

/* 사진 위치 이동 및 크기 조절 */
function move_photo() {
  $(".user_photo").draggable( {
    cursor: "pointer",
    containment: "main"
  });
};

/* 우클릭 시 사진 변경 모달 띄우기 */
$(".user_photo").bind("contextmenu", function(e) {
  $("#modal_bg2").css('display', 'flex');
  return false;
});

profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);
people.addEventListener("click", goPeople);

for (var i = 0; i < r_c.length; i++) {
  r_c[i].addEventListener("click", change_room_num);
}
for (var i = 0; i < modalcomeout.length; i++) {
  modalcomeout[i].addEventListener("click", closeMsg);
}

add.addEventListener("click", addPhoto);
upload.addEventListener("click", move_and_stop); // 사진 편집 후 DB에 저장