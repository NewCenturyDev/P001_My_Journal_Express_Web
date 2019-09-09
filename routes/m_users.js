/* --------------------------------------------------------------------------- */
/* ------------------------- 기본 정의 (Module, DB) -------------------------- */
/* --------------------------------------------------------------------------- */

/* 의존관계 정보 */
var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var router = express.Router();
var fs = require("fs-extra");

/* DB 정보 */
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'nodejs',
  password : '00000000', // 각자 nodejs가 사용할 user, password로 변경 후 작업
  // port : 3306,
  database : 'project',
  charset  : 'utf8'
});

/* 세션 정보 */
//app.js에 세션정보 등록해놔서 별도의 세션 등록은 필요없음.

/* mysql 접속 및 이용할 데이터베이스 설정 */
connection.connect();
connection.query('USE project', function(err,rows,fields){
  if(!err)
    console.log('DB OK_ (m_users)');
  else
    console.log('DB ERR_', err);
});

/* --------------------------------------------------------------------------- */
/* ------------------------ 기본 정의 끝 (Module, DB) ------------------------- */
/* --------------------------------------------------------------------------- */



/* --------------------------------------------------------------------------- */
/* --------------------------- 페이지뷰 (EJS 등록) ---------------------------- */
/* --------------------------------------------------------------------------- */

/* GET auth pages */
router.get('/', function(req, res) {
    if(req.session.user){
      //이미 로그인되어 있을 경우
      res.redirect('/mobile/contents');
    }
    else{
      res.render('mobile/m_login', { title: 'Express' });
    }
});

router.get('/register', function(req, res) {
    if(req.session.user){
      //이미 로그인되어 있을 경우
      res.redirect('/mobile/contents');
    }
    else{
      res.render('mobile/m_register', { title: 'Express' });
    }
});

router.get('/finder', function(req, res) {
    if(req.session.user){
      //이미 로그인되어 있을 경우
      res.redirect('/mobile/contents');
    }
    else{
      res.render('mobile/m_finder', { title: 'Express' });
    }
});
/* --------------------------------------------------------------------------- */
/* -------------------------- 페이지뷰 끝 (EJS 등록) --------------------------- */
/* --------------------------------------------------------------------------- */



/* --------------------------------------------------------------------------- */
/* -------------------------------- 기능 구현 --------------------------------- */
/* --------------------------------------------------------------------------- */

/* --------- 계정 관련 기능 (로그인, 로그아웃, 회원가입, 회원탈퇴 기능) --------- */

//로그인 처리 알고리즘
router.post('/login', function(req, res){
    /* 변수 선언 */
    var auth = {
      "id": req.body.id,
      "pw": req.body.pw
    } //양식을 임시 저장할 객체
    var sql = 'SELECT * FROM member'; //Mysql 쿼리 양식
  
    /* 알고리즘 */
  
    //DB에서 회원정보 읽어와서 사용자가 입력한 내용과 대조
    connection.query(sql, function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else {
            for(var i=0; i<rows.length; i++){
                if(rows[i].member_id == auth.id && rows[i].member_pw == auth.pw){
                    //세션 생성
                    req.session.user = {
                    "id" : rows[i].member_id,
                    "nick" : rows[i].member_nick,
                    "name" : rows[i].member_name
                    }
                    console.log('로그인 처리 - 세션 저장');
                    res.send ('<script>alert("로그인 되었습니다!"); location.href = "/mobile/contents";</script>');
                }
            }
            //일치하는 id,pw가 없음
            res.send ('<script>alert("ID와 PW를 다시 확인하여 주십시오!"); location.href = "/mobile/auth";</script>');
       }
    });
    //디버깅용 로그
    console.log(auth);
});
  
//로그아웃 처리 알고리즘
router.get('/logout', function(req, res){
    req.session.destroy();
    console.log('로그아웃 처리 - 세션 삭제');
    res.redirect('/mobile');
});
  
//회원가입 처리 알고리즘
router.post('/register', function(req, res){
    /* 변수 선언 */
    //양식을 임시 저장할 객체
    var info = {
      "id": req.body.id,
      "pw": req.body.pw,
      "pwck": req.body.pwck,
      "name": req.body.name,
      "nick": req.body.nick,
      "mail": req.body.mail,
      "phone": req.body.phone
    }
    //양식 검증용 정규식
    var RegExp1 = /^[0-9]*$/;
    var RegExp2 = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
    //Mysql 쿼리 양식
    var sql = 'INSERT INTO member (member_id, member_pw, member_name, member_nick, member_email, member_phone) VALUES(?, ?, ?, ?, ?, ?)';
    var params = [info.id,info.pw,info.name,info.nick,info.mail,info.phone];
    var sqls = 'SELECT * from member';

    /* 알고리즘 */
    //사용자가 입력한 회원가입 양식 검증
    if(info.id==""||info.pw==""||info.pwck==""||info.name==""||info.nick==""||info.mail==""||info.phone==""){
      res.send ('<script>alert("회원가입 양식의 모든 필드를 채워주셔야 합니다. 빈 칸은 허용되지 않습니다!"); location.href = "/mobile/auth/register";</script>');
    }
    if(info.pw!=info.pwck){
      res.send ('<script>alert("비밀번호와 비밀번호 확인 필드의 값이 서로 다릅니다!"); location.href = "/mobile/auth/register";</script>');
    }
    if(!RegExp1.test(info.phone)){
      res.send ('<script>alert("전화번호는 숫자만 입력하여 주십시오! ( - 는 생략해 주십시오.)"); location.href = "/mobile/auth/register";</script>');
    }
    if(!RegExp2.test(info.mail)){
      res.send ('<script>alert("이메일 양식이 올바르지 않습니다! ( example@service.com 형식으로 입력해 주십시오)"); location.href = "/mobile/auth/register";</script>');
    }
  
    //양식에 문제 없으면 DB에 저장
    connection.query(sqls, function(err, rowss, fields){
    if(err){
      console.log(err);
    }
    else {
      for(var i=0; i<rowss.length; i++){
        if(rowss[i].member_id == info.id){
          console.log('아이디 중복');
          res.send ('<script>alert("아이디가 중복 됩니다!"); location.href = "/mobile/auth/register";</script>');
        }
        if(rowss[i].member_nick == info.nick){
          console.log('닉네임 중복');
          res.send ('<script>alert("닉네임이 중복 됩니다!"); location.href = "/mobile/auth/register";</script>');
        }
      }
      connection.query(sql, params, function(err, rows, fields){
        if(err){
          console.log(err);
          res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/mobile/auth/register";</script>');
          return;
        }
        else {
          console.log(rows.insertId);
          fs.mkdirSync('uploads/'+info.id);
          fs.mkdirSync('uploads/'+info.id+'/1');
          fs.mkdirSync('uploads/'+info.id+'/2');
          fs.mkdirSync('uploads/'+info.id+'/3');
          console.log(info.id+' 폴더 생성');
          for (var i = 1; i < 4; i++) {
            var sql_ins = 'INSERT INTO page(num, member_id, title) VALUES(?, ?, ?)';
            var params_ins = [i, info.id, info.id+"'s Journal"];
            connection.query(sql_ins, params_ins, function (err) {
              if (err) {console.log(err+'실패');}
                else {
                  res.send ('<script>alert("회원가입 되었습니다! 로그인 하여 주십시오."); location.href = "/mobile/auth";</script>');
                }
              });
            }
          } // 첫 사진 등록 시 회원의 사진 폴더 생성
        });
      }
      //디버깅용 로그
      console.log(info);
  });
});
  
//회원탈퇴 처리 알고리즘
router.post('/resign', function(req, res){
    /* 변수 선언 */
    //양식을 임시 저장할 객체
    var user = req.session.user;
    var auth = {
      "id": req.body.id,
      "pw": req.body.pw
    }
    //Mysql 쿼리 양식
    var sql = 'SELECT member_id FROM member WHERE member_id = ? AND member_pw = ?';
    var params_s = [auth.id, auth.pw];
    var params_d;
    /* 알고리즘 */
    //세션정보 검증 (세션정보의 id값으로 DB에서 비밀번호 조회)
    connection.query(sql, params_s, function(err, rows, fields){
        if(err) {
            console.log(err);
        }
        else if (rows[0]==undefined || auth.id != user.id) {
            res.send ('<script>alert("2차 인증이 실패했습니다. ID와 PW를 다시 확인해 주십시오!"); location.href = "/mobile/profile";</script>');
        } //일치하는 id,pw가 없음
        else {
            console.log('회원탈퇴 처리 시작');
            //회원탈퇴 쿼리
            sql = 'DELETE FROM member WHERE member_id = ?';
            params_d = auth.id;
            connection.query(sql, params_d, function(err, result){
                if(err) {
                    console.log('회원탈퇴 처리 실패 - ', err);
                    res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/mobile/profile";</script>');
                }
                else {
                    edit_msg_num(); // 쪽지 번호 갱신
                    console.log('회원탈퇴 처리 완료' + result);
                    req.session.destroy();
                    res.send ('<script>alert("회원 탈퇴 되었습니다!"); location.href = "/mobile";</script>');
                }
            });
        }
    });
    //디버깅용 로그
    console.log(auth);
});
  
//ID 찾기 알고리즘
router.post('/idfinder', function(req, res){
    /* 변수 선언 */
    //양식을 임시 저장할 객체
    var auth = {
      "email": req.body.e1
    }
    let result;
    //Mysql 쿼리 양식
    var sql = 'SELECT * FROM member';
  
    /* 알고리즘 */
    connection.query(sql, function(err, rows, fields){
        if(err){
            console.log(err);
            res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/mobile/auth/finder";</script>');
        }
        else{
            for(var i=0; i<rows.length; i++){
                if(rows[i].member_email == auth.email){
                    console.log('id조회 처리 시작');
                    //email이 일치하는 member의 열에서 id 반환
                    result = '<script>alert("해당 정보로 조회한 사용자의 ID는 ' + rows[i].member_id + ' 입니다."); location.href = "/mobile/auth";</script>';
                    res.send (result);
                }
            }
            //일치하는 id,pw가 없음
            res.send ('<script>alert("입력하신 내용과 일치하는 회원정보가 없습니다."); location.href = "/mobile/auth/finder";</script>');
        }
    });
});
  
//PW 찾기 알고리즘
router.post('/pwfinder', function(req, res){
    /* 변수 선언 */
    //양식을 임시 저장할 객체
    var auth = {
      "id": req.body.id,
      "name": req.body.name,
      "email": req.body.e2
    }
    let result;
    //Mysql 쿼리 양식
    var sql = 'SELECT * FROM member';
  
    /* 알고리즘 */
    connection.query(sql, function(err, rows, fields){
        if(err){
            console.log(err);
            res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/mobile/auth/finder";</script>');
        }
        else{
            for(var i=0; i<rows.length; i++){
                if(rows[i].member_email == auth.email && rows[i].member_name == auth.name && rows[i].member_id == auth.id){
                    console.log('pw조회 처리 시작');
                    //email,성명,id가 일치하는 member의 열에서 pw 반환
                    result = '<script>alert("해당 정보로 조회한 사용자의 PW는 ' + rows[i].member_pw + ' 입니다."); location.href = "/mobile/auth";</script>';
                    res.send (result);
                }
            }
            //일치하는 id,pw가 없음
            res.send ('<script>alert("입력하신 내용과 일치하는 회원정보가 없습니다."); location.href = "/mobile/auth/finder";</script>');
        }
    });
});
/* ------------------------- 계정 관련 기능 끝 ------------------------- */


/* --------------------------------------------------------------------------- */
/* ------------------------------- 기능 구현 끝 -------------------------------- */
/* --------------------------------------------------------------------------- */



module.exports = router;