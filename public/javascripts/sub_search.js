// 상단바 메뉴 변수
var profile = document.getElementById('profile');
var logout = document.getElementById('logout');
var people = document.getElementById('people');

// 쪽지 구현 변수
var send = document.getElementsByClassName('send');
var plettle = document.getElementsByClassName("plettle")[0];
var nicname = document.getElementById('msg_nick');
var modalcomeout = document.getElementsByClassName("modalcomeout")[0];
var r_nick = document.getElementById('r_nick');

// 날짜 변수
var today = new Date();
var yyyy = today.getFullYear();
var mm = today.getMonth()+1;
var dd = today.getDate();

// 날짜 설정 부분
if(dd<10) {dd='0'+dd} 
if(mm<10) {mm='0'+mm} 

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

function sendMsg() {
    var temp = $('.send').index(this);
    var id = ($('.r_id').eq(temp)).val();
    var img = ($('.pre_img').eq(temp)).val();

    if (img==='null') {
        $("#s_img").html(`<img src="/images/profile_list.jpg" alt="">`);
    } //등록 프로필 사진 없을 때 기본 출력
    else {
        img = "/img/"+id+"/"+img;
        $("#s_img").html(`<img src="${img}" alt="">`);
    }//등록 프로필 사진 있을 때 출력
    
    nicname.innerHTML = `<h1>${this.value}</h1>`;
    date.innerHTML = `<h2>${yyyy}-${mm}-${dd} 발신<h2>`;
    r_nick.value = this.value;



    plettle.style.display = 'flex';

    
} // 값 설정 후 쪽지 모달 띄움
function closeMsg() {
    plettle.style.display = 'none';
}

// 상단바 버튼
profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);
people.addEventListener("click", goPeople);

//쪽지 구현 버튼
for (var i = 0; i< send.length; i++) {
    send[i].addEventListener("click", sendMsg);
}
modalcomeout.addEventListener("click", closeMsg);