var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");

/* 스토리지 정보 */
var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    var extension = path.extname(file.originalname);  //파일 확장자
    var basename = path.basename(file.originalname, extension); //파일 이름
    cb(null, basename + "-" + Date.now() + extension);
  }
});

// 1. multer 미들웨어 등록
var upload = multer({
  storage: storage
});

// 뷰 페이지 경로
router.get('/upload', function(req, res) {
  if(req.session.user){
    res.render("upload");
  }
  else{
    res.send('<script>alert("로그인 해주세요!"); location.href = "/login";</script>');
  }
});

// 2. 파일 업로드 처리
/* 파일 업로드 알고리즘 */
router.post('/upload', upload.single("file"), function(req, res, next) {
    // 3. 파일 객체
    var file = req.file

    // 4. 파일 정보
    var result = {
        originalName : file.originalname,
        size : file.size,
    }

    res.send('<script>alert(업로드되었습니다!); location.href = "/contents";</script>');
    console.log(result);
});

module.exports = router;