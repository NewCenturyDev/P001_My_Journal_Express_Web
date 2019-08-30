/* ---------------------------------------------------------------------- */
/* ------------------------------ 변수 선언 ------------------------------ */
/* ---------------------------------------------------------------------- */

// 상단 메뉴 버튼
var profile = document.getElementById('profile');
var logout = document.getElementById('logout');

// 탭 메뉴 전환
var navbutton = document.getElementsByClassName("navbutton");
var myinfo = document.getElementsByClassName("myinfo")[0];
var subscribe = document.getElementsByClassName("subscribe")[0];
var letter = document.getElementsByClassName("letter")[0];
var modify_info = document.getElementsByClassName("modify_info")[0];
var resign = document.getElementsByClassName("resign")[0];

// 회원정보 수정 div 전환
var personal_msg = document.getElementById("modify_personal_msg");
var remodifys = document.getElementsByClassName("remodify")[0];
var modify_auth = document.getElementsByClassName("modify_auth")[0];

// 회원 이미지 변경 버튼
var edit_pro_img = document.getElementById('edit_pro');

// 구독 탭 타일 버튼
var move = document.getElementsByClassName("move");
var remove = document.getElementsByClassName("remove");

// 쪽지 탭 테이블
var pre_nick = document.getElementsByClassName('pre_nick');
var pre_cont = document.getElementsByClassName('pre_cont');
var pre_date = document.getElementsByClassName('pre_date');
var pre_num = document.getElementsByClassName('pre_num');
var pre_id = document.getElementsByClassName('pre_id');
var pre_img = document.getElementsByClassName('pre_img');

// 회원 이미지 변경 모달창
var add_modal_bg = document.getElementById('add_modal_bg');

// 쪽지 모달창
var modalcomeon = document.getElementsByClassName("modalcomeon");
var modalcomeout = document.getElementsByClassName("modalcomeout");
var plettle = document.getElementsByClassName("plettle")[0];
var msg_nick = document.getElementById('msg_nick');
var date = document.getElementById('date');
var msg_cont = document.getElementById('msg_cont');
var msg_reply = document.getElementById('msg_reply');
var msg_del = document.getElementById('msg_del');
var msg_send = document.getElementById('msg_send');
var msg_cont = document.getElementById('msg_cont');
var r_nick = document.getElementById('r_nick');

/* ---------------------------------------------------------------------- */
/* ----------------------------- 변수 선언 끝 ----------------------------- */
/* ---------------------------------------------------------------------- */


/* ---------------------------------------------------------------------- */
/* ------------------------------ 기능 구현 ------------------------------ */
/* ---------------------------------------------------------------------- */

/* ----------------------------- 탭 전환 기능 ----------------------------- */
// 탭 전환 기능 초기화
function Initalize(){
    // 파람 값이 있을 경우는 정보 수정페이지로 이동
    if(getParameterByName('auth') == 1){
        initTab();
        display_Modifyinfo();
        modify_auth.style.display = "none";
        remodifys.style.display ="block";
    }
    else{
        initTab();
        display_Myprofile();
    }
    return;
}

//내 프로필 탭 활성화 함수
function display_Myprofile(){
    console.log(myinfo.style.display);
    initTab();
    myinfo.style.display = 'flex';
    navbutton[0].style.color = "rgb(43, 83, 193)";
    navbutton[0].style.fontWeight = "bold";
    return;
}

//구독 탭 활성화 함수
function display_Subscribe(){
    console.log(subscribe.style.display);
    initTab();
    subscribe.style.display = 'block';
    navbutton[1].style.color = "rgb(43, 83, 193)";
    navbutton[1].style.fontWeight = "bold";
    return;
}

//쪽지함 탭 활성화 함수
function display_Letterbox(){
    console.log(letter.style.display);
    initTab();
    letter.style.display = 'block';
    navbutton[2].style.color = "rgb(43, 83, 193)";
    navbutton[2].style.fontWeight = "bold";
    return;
}

//정보수정 탭 활성화 함수
function display_Modifyinfo(){
    console.log(modify_info.style.display);
    initTab();
    modify_info.style.display = 'block';
    navbutton[3].style.color = "rgb(43, 83, 193)";
    navbutton[3].style.fontWeight = "bold";
    return;
}

//회원탈퇴 탭 활성화 함수
function display_Resign(){
    console.log(resign.style.display);
    initTab();
    resign.style.display = 'block';
    navbutton[4].style.color = "rgb(43, 83, 193)";
    navbutton[4].style.fontWeight = "bold";
    return;
}

//탭 전환시 초기화 함수
function initTab(){
    myinfo.style.display = 'none';
    subscribe.style.display = 'none';
    letter.style.display = 'none';
    modify_info.style.display = 'none';
    resign.style.display = 'none';
    for(var i = 0; i < 5; i++){
        navbutton[i].style.backgroundColor = '';
        navbutton[i].style.color = "grey";
        navbutton[i].style.fontWeight = "normal";
    }
    return;
}

//내 프로필 탭 개인메시지 변경 함수
function modify_personal_msg(){
    if(personal_msg.style.display == 'block'){
        personal_msg.style.display = 'none';
    }
    else{
        personal_msg.style.display = 'block';
    }
    return;
}

//정보수정 탭 보안절차 통과 여부 확인 함수
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//구독 탭 타일 링크
function move_cont() {
    this.value = 'move';
}

//구독 탭 타일 삭제
function remove_sub() {
    this.value = 'remove';
}
/* --------------------------- 탭 전환 기능 끝 --------------------------- */

/* --------------------------- 쪽지 수발신 기능 --------------------------- */
//쪽지 모달창 표시 함수
function megModalDisplay() {
    var index = this.value;
    var id = pre_id[index].value;
    var img = pre_img[index].value;
    
    if (img==='null') {
        $("#s_img").html(`<img src="/images/profile_list.jpg" alt="">`);
    } //등록 프로필 사진 없을 때 기본 출력
    else {
        img = "/img/"+id+"/"+img;
        $("#s_img").html(`<img src="${img}" alt="">`);
    }//등록 프로필 사진 있을 때 출력
    
    msg_nick.innerHTML=`<h1>${pre_nick[index].value}</h1>`;
    date.innerHTML=`<h2>${pre_date[index].value} 수신</h2>`;
    msg_cont.innerHTML=pre_cont[index].value;
    msg_del.value = pre_num[index].value;
    r_nick.value = pre_nick[index].value;
    //선택 내용 모달창에 옮김
    if (plettle.style.display == 'none') {
        plettle.style.display = 'flex';
    }
}

//쪽지 모달창 닫기 함수
function modalnoneDisplay(){
    console.log(plettle.style.display);
    if(plettle.style.display =="flex"){
        plettle.style.display = 'none';
    }
    if(add_modal_bg.style.display == 'flex') {
        add_modal_bg.style.display = 'none';
    }
}

//모달창 전환 함수
function change_modal() {
    msg_cont.value = "";
    msg_cont.removeAttribute('readonly');
    msg_del.style.display = 'none';
    msg_send.style.display = 'inline';
    this.style.display = 'none';
}

function openProfileImg() {
    add_modal_bg.style.display = 'flex';
}

/* ------------------------- 쪽지 수발신 기능 끝 ------------------------- */

/* --------------------------- 상단 메뉴 버튼 기능 --------------------------- */
// 상단 메뉴 버튼 기능
function goProfile() {
    location.href = "/profile";
}
function logOut() {
    alert('로그아웃 되었습니다!');
    location.href = "/logout";
}
/* ------------------------- 상단 메뉴 버튼 기능 끝 ------------------------- */

/* ---------------------------------------------------------------------- */
/* ----------------------------- 기능 구현 끝 ----------------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ---------------------------- 이벤트 리스너 ---------------------------- */
/* ---------------------------------------------------------------------- */
//상단 메뉴
profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);

//프로필 이미지 변경 모달창
edit_pro_img.addEventListener("click", openProfileImg);

//쪽지 모달창
for (var i = 0; i < modalcomeon.length; i++) {
    modalcomeon[i].addEventListener("click", megModalDisplay);
}
//모달창 닫기
for (var i = 0; i < modalcomeout.length; i++) {
    modalcomeout[i].addEventListener("click", modalnoneDisplay);
}
msg_reply.addEventListener("click", change_modal);

//구독 탭
for (var i = 0 ; i < move.length; i++) {
    move[i].addEventListener("click", move_cont);
    remove[i].addEventListener("click", remove_sub);
}
/* ---------------------------------------------------------------------- */
/* --------------------------- 이벤트 리스너 끝 --------------------------- */
/* ---------------------------------------------------------------------- */
