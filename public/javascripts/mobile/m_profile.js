/* ---------------------------------------------------------------------- */
/* ------------------------------ 변수 선언 ------------------------------ */
/* ---------------------------------------------------------------------- */

// 탭 메뉴 전환
var myinfo = document.getElementById('myprofile');
var subscribe = document.getElementById('subscribe');
var letter = document.getElementById('letter');

// 구독 탭 타일 버튼
var move = document.getElementsByClassName("move");
var remove = document.getElementsByClassName("remove");

// 쪽지 탭 테이블
var pre_nick = document.getElementsByClassName('pre_nick');
var pre_cont = document.getElementsByClassName('pre_cont');
var pre_date = document.getElementsByClassName('pre_date');
var pre_num = document.getElementsByClassName('pre_num');

// 쪽지 모달창
var modalcomeon = document.getElementsByClassName("modalcomeon");
var modalcomeout = document.getElementsByClassName("modalcomeout")[0];
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
//내 프로필 탭 활성화 함수
function display_Myprofile(){
    console.log(myprofile.style.display);
    initTab();
    myprofile.style.display = 'block';
    return;
}

//구독 탭 활성화 함수
function display_Subscribe(){
    console.log(subscribe.style.display);
    initTab();
    subscribe.style.display = 'block';
    return;
}

//쪽지함 탭 활성화 함수
function display_Letterbox(){
    console.log(letter.style.display);
    initTab();
    letter.style.display = 'block';
    return;
}

//탭 전환시 초기화 함수
function initTab(){
    myprofile.style.display = 'none';
    subscribe.style.display = 'none';
    letter.style.display = 'none';
    return;
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
    msg_nick.innerHTML=`<h1>${pre_nick[index].value}</h1>`;
    date.innerHTML=`<h2>${pre_date[index].value} 수신</h2>`;
    msg_cont.innerHTML=pre_cont[index].value;
    msg_del.value = pre_num[index].value;
    r_nick.value = pre_nick[index].value;

    if (plettle.style.display == 'none') {
        plettle.style.display = 'block';
    }
}

//쪽지 모달창 닫기 함수
function modalnoneDisplay(){
    console.log(plettle.style.display);
    if(plettle.style.display =="block"){
        plettle.style.display = 'none';
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
/* ------------------------- 쪽지 수발신 기능 끝 ------------------------- */
/* ---------------------------------------------------------------------- */
/* ----------------------------- 기능 구현 끝 ----------------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ---------------------------- 이벤트 리스너 ---------------------------- */
/* ---------------------------------------------------------------------- */

//쪽지 모달창
for (var i = 0; i < modalcomeon.length; i++) {
    modalcomeon[i].addEventListener("click", megModalDisplay);
}
modalcomeout.addEventListener("click", modalnoneDisplay);
msg_reply.addEventListener("click", change_modal);

//구독 탭
for (var i = 0 ; i < move.length; i++) {
    move[i].addEventListener("click", move_cont);
    remove[i].addEventListener("click", remove_sub);
}

/* ---------------------------------------------------------------------- */
/* --------------------------- 이벤트 리스너 끝 --------------------------- */
/* ---------------------------------------------------------------------- */