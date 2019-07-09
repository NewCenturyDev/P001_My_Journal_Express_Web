var myinfo = document.getElementsByClassName("myinfo")[0];
var sub = document.getElementsByClassName("sub")[0];
var button1 = document.getElementsByClassName("button b1 1")[0];
var button2 = document.getElementsByClassName("button b1 2")[0];

function myDisplay(){
    console.log(myinfo.style.display);
    if(myinfo.style.display=='none'){
        myinfo.style.display = 'flex';
        sub.style.display = 'none';
    }
}

function subDisplay(){
    console.log(sub.style.display);
    if(sub.style.display=='none'){
        sub.style.display = 'block';
        myinfo.style.display = 'none';
    }
}

button1.addEventListener("click", myDisplay);
button2.addEventListener("click", subDisplay);