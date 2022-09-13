var express = require('express');
var router = express.Router();
var multer = require("multer");
var mysql = require('mysql');
var path = require("path");
var fs = require("fs-extra");

/* DB 정보 */
var dbconfig = require('../dbconfig.json');
var connection = mysql.createConnection(dbconfig);

/* 세션 정보 */
//app.js에 세션정보 등록해놔서 별도의 세션 등록은 필요없음.

/* mysql 접속 및 이용할 데이터베이스 설정 */
connection.connect();
connection.query('USE ' + dbconfig.database, function(err,rows,fields){
  if(!err)
    console.log('DB OK_ (index)');
  else
    console.log('DB ERR_', err);
});

// 파일 업로드 처리
/* 파일 업로드 알고리즘 */

router.post('/profile_upload', function(req, res) {
  var login_id = req.session.user.id;
  var sql_sel = 'SELECT member_img FROM member WHERE member_id = ?';

  connection.query(sql_sel, login_id, function(err, row) {
    if (err) {console.log(err);}
    else {
      if (row[0].member_img!=null) {
        fs.unlink('./uploads/'+login_id+'/'+row[0].member_img);
      } // 프로필 사진이 존재할 경우 작업 전 먼저 삭제
      var storage = multer.diskStorage({
        destination: function (req, file, cb){
          cb(null, 'uploads/'+login_id);
        }, // 회원 폴더에 프로필 사진 저장
        filename: function (req, file, cb){
          var extension = path.extname(file.originalname); //파일 확장자
          var filename = login_id + '_profile' + extension;
          cb(null, filename);
    
          var params_udt = [filename, login_id];
          var sql_udt = "UPDATE member SET member_img = ? WHERE member_id = ?";
          connection.query(sql_udt, params_udt, function(err, rows, field) {
            if (err) {console.log(err);}
            else {
              console.log('db에 프로필 사진 업데이트 성공');
            }
          }); // db에도 변경된 사진 저장 (이름은 동일, 확장자는 다를 수도)
        }
      });

        var upload = multer({storage: storage}).single("file");
        upload(req, res, function(err) {
          if (err) {console.log(err);}
          else {
            console.log('업데이트 완료');
            res.send('<script>alert("프로필 사진이 변경되었습니다!");</script>');
          }
        });
    }
  });
});

router.post('/text_upload', function(req, res) {
  var text = {
    "title": req.body.text_name,
    "contents": req.body.msg_cont
  };
  text.title=text.title+"-"+Date.now();
  var params_ins=[text.title, text.contents, req.session.user.id, req.body.add_num, req.body.type];
  var sql_ins = "INSERT INTO photo(photo_name, contents, member_id, room_num, type, width, height) values(?, ?, ?, ?, ?, 'auto', 'auto')";
  connection.query(sql_ins, params_ins, function (err, rows) {
    if (err) {
      console.log('삽입 실패\n'+err);
    }
    else {
      console.log('텍스트 삽입 성공');
      res.send ('<form id="sample" action="/contents" method="post">'
      +'<input style="display: none;" name="visit_to" type="text" value="'+req.session.user.id+'">'
      +'<input style="display: none;" name="room_num" type="text" value="'+req.body.add_num+'">'
      +'<input style="display: none;" type="submit" value="submit">'
      +'<script>alert("업로드 되었습니다!"); document.getElementById("sample").submit();</script>');
    }
  });
}); // 텍스트 업로드

router.post('/upload', function(req, res, next) {
  if (!req.session.user) {
    res.send('<script>alert("로그인 해주세요!"); location.href = "/login";</script>');
    return;
  } // 로그아웃 시 사진 등록 기능 제한

  var login_id = req.session.user.id;
  // console.log(req.body.photo_name);//왜?
  var storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, 'uploads/'+login_id+'/'+req.body.add_num);
    }, // 회원 폴더에 사진 저장
    filename: function (req, file, cb){
      var extension = path.extname(file.originalname); //파일 확장자
      var file_name = req.body.photo_name + "-" + Date.now() + extension;
      // var basename = path.basename(file.originalname, extension); // 파일 이름
      cb(null, file_name);

      // 등록 회원 및 사진 정보를 DB의 photo table에도 저장
      console.log(req.body.add_num);
      var params_ins = [file_name, login_id, req.body.add_num, req.body.type];
      var sql_ins = "INSERT INTO photo(photo_name, member_id, room_num, type, width, height) values(?, ?, ?, ?, 250, 250)";
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
       res.send ('<form id="sample" action="/contents" method="post">'
          +'<input style="display: none;" name="visit_to" type="text" value="'+req.session.user.id+'">'
          +'<input style="display: none;" name="room_num" type="text" value="'+req.body.upload_num+'">'
          +'<input style="display: none;" type="submit" value="submit">'
          +'<script>alert("업로드 되었습니다!"); document.getElementById("sample").submit();</script>');
    } // 업로드 후 갤러리로 이동
  });
});

module.exports = router;
