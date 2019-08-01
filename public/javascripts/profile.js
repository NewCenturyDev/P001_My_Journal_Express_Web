var myinfo = document.getElementsByClassName("myinfo")[0];
var sub = document.getElementsByClassName("sub")[0];
var lettle = document.getElementsByClassName("lettle")[0];
var idout = document.getElementsByClassName("idout")[0];
var modalcomeon = document.getElementsByClassName("modalcomeon");
var plettle = document.getElementsByClassName("plettle")[0];
var modalcomeout = document.getElementsByClassName("modalcomeout")[0];
var profile = document.getElementById('profile');
var logout = document.getElementById('logout');

var move = document.getElementsByClassName("move");
var remove = document.getElementsByClassName("remove");

var pre_nick = document.getElementsByClassName('pre_nick');
var pre_cont = document.getElementsByClassName('pre_cont');
var pre_date = document.getElementsByClassName('pre_date');
var pre_num = document.getElementsByClassName('pre_num');

var nicname = document.getElementById('nicname');
var date = document.getElementById('date');
var msg_cont = document.getElementById('msg_cont');

var msg_reply = document.getElementById('msg_reply');
var msg_del = document.getElementById('msg_del');
var msg_but = document.getElementById('msg_but');

var msg_cont = document.getElementById('msg_cont');

var r_nick = document.getElementById('r_nick');

function myDisplay(){
    console.log(myinfo.style.display);
    if(myinfo.style.display=='none'){
        myinfo.style.display = 'flex';
        sub.style.display = 'none';
        lettle.style.display = 'none';
        idout.style.display = 'none';
    }
}

function subDisplay(){
    console.log(sub.style.display);
    if(sub.style.display=='none'){
        sub.style.display = 'block';
        myinfo.style.display = 'none';
        lettle.style.display = 'none';
        idout.style.display = 'none';
    }
}

function letDisplay(){
    console.log(lettle.style.display);
    if(lettle.style.display=='none'){
        lettle.style.display = 'block';
        myinfo.style.display = 'none';
        sub.style.display = 'none';
        idout.style.display = 'none';
    }
}

function idDisplay(){
    console.log(idout.style.display);
    if(idout.style.display=='none'){
        idout.style.display = 'block';
        myinfo.style.display = 'none';
        sub.style.display = 'none';
        lettle.style.display = 'none';
    }
}

function modalDisplay() {
    var index = this.value;
    nicname.innerHTML=`<h1>${pre_nick[index].value}</h1>`;
    date.innerHTML=`<h2>${pre_date[index].value} 수신</h2>`;
    msg_cont.innerHTML=pre_cont[index].value;
    msg_del.value = pre_num[index].value;
    r_nick.value = pre_nick[index].value;

    if (plettle.style.display == 'none') {
        plettle.style.display = 'block';
    }
}

function modalnoneDisplay(){
    console.log(plettle.style.display);
    if(plettle.style.display =="block"){
        plettle.style.display = 'none';
    }
}

function change_modal() {
    msg_cont.value = "";
    msg_cont.removeAttribute('readonly');
    msg_del.style.display = 'none';
    msg_but.style.display = 'inline';
    this.style.display = 'none';
}

function goProfile() {
    location.href = "/contents";
}

function logOut() {
    alert('로그아웃 되었습니다!');
    location.href = "/logout";
}

function move_cont() {
    this.value = 'move';
}

function remove_sub() {
    this.value = 'remove';
}

modalcomeout.addEventListener("click", modalnoneDisplay);
profile.addEventListener("click", goProfile);
logout.addEventListener("click", logOut);

msg_reply.addEventListener("click", change_modal);

for (var i = 0 ; i < move.length; i++) {
    move[i].addEventListener("click", move_cont);
    remove[i].addEventListener("click", remove_sub);
}

for (var i = 0; i < modalcomeon.length; i++) {
    modalcomeon[i].addEventListener("click", modalDisplay);
}