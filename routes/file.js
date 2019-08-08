var express = require('express');
var router = express.Router();
var multer = require("multer");
var mysql = require('mysql');
var path = require("path");
var fs = require("fs-extra");
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'nodejs',
  password : '00000000', // 각자 nodejs가 사용할 user, password로 변경 후 작업
  // port : 3306,
  database : 'project',
  charset  : 'utf8'
});
connection.connect();
connection.query('USE project', function(err,rows,fields){
  if(!err)
    console.log('DB INFO_ ', rows);
  else
    console.log('DB ERR_', err);
});


/* 스토리지 정보 */

// 뷰 페이지 경로
router.get('/upload', function(req, res) {
  if(req.session.user){
    res.render("upload");
  }
  else{
    res.send('<script>alert("로그인 해주세요!"); location.href = "/login";</script>');
  }
});

// 파일 업로드 처리
/* 파일 업로드 알고리즘 */
router.post('/upload', function(req, res, next) {
  if (!req.session.user) {
    res.send('<script>alert("로그인 해주세요!"); location.href = "/login";</script>');
    return;
  } // 로그아웃 시 사진 등록 기능 제한

  var login_id = req.session.user.id;
  if (!fs.existsSync('uploads/'+login_id)) {
    fs.mkdirSync('uploads/'+login_id);
    fs.mkdirSync('uploads/'+login_id+'/1');
    fs.mkdirSync('uploads/'+login_id+'/2');
    fs.mkdirSync('uploads/'+login_id+'/3');
    console.log(login_id+' 폴더 생성');
  } // 첫 사진 등록 시 회원의 사진 폴더 생성, 회원 가입 때 만들기

  //console.log(req.body.photo_name);//왜?
  
  var storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, 'uploads/'+login_id+'/'+req.body.room_num);
    }, // 회원 폴더에 사진 저장
    filename: function (req, file, cb){
      var extension = path.extname(file.originalname); //파일 확장자
      var file_name = req.body.photo_name + "-" + Date.now() + extension;
      // var basename = path.basename(file.originalname, extension); // 파일 이름
      cb(null, file_name);

      // 등록 회원 및 사진 정보를 DB의 photo table에도 저장
      var params_ins = [file_name, login_id, req.body.room_num];
      var sql_ins = "INSERT INTO photo(photo_name, member_id, room_num) values(?, ?, ?)";
      connection.query(sql_ins, params_ins, function(err, rows, field) {
        if (err) {
          console.log(err);
        }
        else {
          console.log('db에 사진 등록 성공');
        }
      });

    }
  });

  var upload = multer({storage: storage}).single("file");

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      // 3. 파일 객체
      var file = req.file

      // // 4. 파일 정보
      var result = {
          originalName : file.originalname,
          size : file.size,
      }
      // console.log(result);
       res.send ('<form id="sample" action="/contents" method="post">'
          +'<input style="display: none;" name="visit_to" type="text" value="'+req.session.user.id+'">'
          +'<input style="display: none;" name="room_num" type="text" value="1">'
          +'<input style="display: none;" type="submit" value="submit">'
          +'<script>alert("업로드 되었습니다!"); document.getElementById("sample").submit();</script>');
    } // 업로드 후 갤러리로 이동
  });
});

module.exports = router;