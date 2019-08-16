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
    console.log('DB OK_ (m_index)');
  else
    console.log('DB ERR_', err);
});

/* --------------------------------------------------------------------------- */
/* ------------------------ 기본 정의 끝 (Module, DB) ------------------------- */
/* --------------------------------------------------------------------------- */



/* --------------------------------------------------------------------------- */
/* --------------------------- 페이지뷰 (EJS 등록) ---------------------------- */
/* --------------------------------------------------------------------------- */

/* GET home page */
router.get('/', function(req, res) {
    if(req.session.user){
      //이미 로그인되어 있을 경우
      res.redirect('/mobile/contents');
    }
    else{
      res.redirect('/mobile/auth/');
    }
});

/* GET contents pages */
router.get('/contents', function(req, res) {
  if(!req.session.user){
    //로그인하지 않은 경우
    res.redirect('/mobile/auth/');
  }
  else{
    res.render('mobile/m_contents', { title: 'Express' });
  }
});

router.get('/contentsframe', function(req, res) {
  if(!req.session.user){
    //로그인하지 않은 경우
    res.redirect('/mobile/auth/');
  }
  else{
    res.render('mobile/m_contentsframe', { title: 'Express' });
  }
});

router.get('/profile', function(req, res) {
  if(!req.session.user){
    //로그인하지 않은 경우
    res.redirect('/mobile/auth/');
  }
  else{
    res.render('mobile/m_profile', { title: 'Express' });
  }
});

router.get('/profileframe', function(req, res) {
  if(!req.session.user){
    //로그인하지 않은 경우
    res.redirect('/mobile/auth/');
  }
  else{
    res.render('mobile/m_profileframe', { title: 'Express' });
  }
});

/* --------------------------------------------------------------------------- */
/* -------------------------- 페이지뷰 끝 (EJS 등록) --------------------------- */
/* --------------------------------------------------------------------------- */



/* --------------------------------------------------------------------------- */
/* -------------------------------- 기능 구현 --------------------------------- */
/* --------------------------------------------------------------------------- */



/* --------------------------------------------------------------------------- */
/* ------------------------------- 기능 구현 끝 -------------------------------- */
/* --------------------------------------------------------------------------- */
  
  
  
module.exports = router;