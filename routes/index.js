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
    console.log('DB OK_ (index)');
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
  if (req.session.user) {
    //이미 로그인되어 있을 경우
    res.send(go_contents(req.session.user.id, 1));
  }
  else {
    var sql_sel_photo = "SELECT substring_index(p.photo_name, '-', 1) p_name, p.*, m.member_nick FROM photo p INNER JOIN member m on m.member_id = p.member_id WHERE p.type='photo' ORDER BY p.cnt DESC LIMIT 3";
    connection.query(sql_sel_photo, function(err1, rows1) {
      if (err1) {console.log(err1);}
      else {
        // 조회수가 높은 사진 검색
        var sql_sel_people = "SELECT m.member_id, m.member_nick, m.member_msg, m.* FROM photo p INNER JOIN member m on m.member_id = p.member_id ORDER BY p.cnt DESC LIMIT 3";
        connection.query(sql_sel_people, function(err2, rows2) {
          if (err2) {console.log(err2);}
          else {
            // 인기있는 사진을 등록한 회원 검색 (테스트 데이터 넣은 후 구독자 많은 순으로 변경 예정)
            var sql_sel_new = "SELECT substring_index(p.photo_name, '-', 1) p_name, p.*, m.member_nick FROM photo p INNER JOIN member m on m.member_id = p.member_id WHERE p.type<>'video' ORDER BY p.date DESC LIMIT 3";
            connection.query(sql_sel_new, function(err3, rows3) {
              if (err3) {console.log(err3);}
              else {
                res.render('main', {
                  popular: rows1,
                  people: rows2,
                  news: rows3
                });
              }
            }); // 최근에 올라온 게시물 검색
          }
        });
      }
    });
  }
}); // 홈페이지 소개 및 주요 게시물, 회원을 보여주는 메인 페이지

/* GET auth pages */
router.get('/login', function(req, res) {
  if(req.session.user){
    //이미 로그인되어 있을 경우
    res.send (go_contents(req.session.user.id, 1));
  }
  else{
    res.render('login', { title: 'Express' });
  }
});
router.get('/register', function(req, res) {
  if(req.session.user){
    //이미 로그인되어 있을 경우
    res.send (go_contents(req.session.user.id, 1));
  }
  else{
    res.render('register', { title: 'Express' });
  }
});
router.get('/finder', function(req, res) {
  if(req.session.user){
    //이미 로그인되어 있을 경우
    res.send (go_contents(req.session.user.id, 1));
  }
  else{
    res.render('finder', { title: 'Express' });
  }
});

router.post('/update_cnt', function(req, res) {
  var type = req.body.page_type; // 이동할 페이지 이름 받음
  var photo_name = new Array();
  var photo_cnt = new Array();

  photo_name = req.body.photos_cnt_name.split(',');
  photo_cnt = req.body.photos_cnt.split(',');

  var sql_udt = "UPDATE photo SET cnt = ? WHERE photo_name = ?";
  for (var i = 0; i < photo_name.length; i++) {
    var params_udt = [photo_cnt[i], photo_name[i]];
    connection.query(sql_udt, params_udt, function(err, req, res) {
      if (err) {
        console.log('갱신 실패\n'+err);
      }
    });
  } // 컨텐츠의 조회수 갱신

  if (type==='profile') {
    res.send('<script>location.href = "/profile";</script>');
  }
  else if (type==='logout') {
    req.session.destroy();
    res.send('<script>alert("로그아웃 되었습니다!"); location.href = "/";</script>');
  }
  else if (type==='search') {
    res.send('<script>location.href = "/search";</script>');
  }
  else if (type==='main') {
    if (req.session.user.id) {
      res.send(go_contents(req.session.user.id), 1);  
    }
    else {
      res.send('<script>location.href = "/";</script>');
    }
  } // 유형에 맞는 페이지로 이동
});

/* GET contents pages */
router.get('/contents', function(req, res) {
  if(!req.session.user){
  //로그인하지 않았을 경우 리다이렉트 시킴
  res.redirect('/');
  }
});
router.post('/contents', function(req, res) {
  var visit_to = req.body.visit_to;
  var room_num = req.body.room_num;
  // 방문한 사람과 room number를 불러옴

  if (!req.session.visit_to || req.body.move) {
    req.session.visit_to = visit_to;
  }
  var login = {
    "id": ""
  }
  if (req.session.user) {
    login.id = req.session.user.id;
    login.nick = req.session.user.nick;
  }

  var sql_sel = "SELECT *, substring_index(photo_name, '-', 1) p_name, date_format(date, '%Y-%m-%d') p_date FROM photo WHERE member_id = ? AND room_num = ? ORDER BY date";
  var params = [req.session.visit_to, room_num];
  console.log(params);
  connection.query(sql_sel, params, function(err1, rows) {
    if (err1) {
      console.log(err);
    }
    else {    
      res.render('contents', {
        login: login,
        rows: rows,
        room_num: room_num
      });
    }
  }); // 방문한 사람이 등록한 사진들 불러옴 (시간 순)

});

router.get('/img/:id/:name', function(req, res) {
  var id = req.params.id;
  var name = req.params.name;

  fs.readFile('./uploads/'+id+'/'+name, function (err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}); // 프로필 사진을 서버 폴더에서 불러와 페이지에 넘겨줌

router.get('/img/:id/:num/:name', function(req, res) {
  var id = req.params.id;
  var num = req.params.num;
  var name = req.params.name;

  fs.readFile('./uploads/'+id+'/'+num+'/'+name, function (err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}); // 등록한 사진을 서버 폴더에서 불러와 페이지에 넘겨줌

router.get('/profile', function(req, res) {
  if(req.session.user) {
    var id = req.session.user.id;
    var sql1 = "SELECT r_id, r_nick FROM subscribe WHERE s_id = ?";
    var params = [id];
    connection.query(sql1, params, function(err1, rows1) {
      if (err1) {
        console.log(err);
      } else {
        var nick = req.session.user.nick;
        var sql2 = "SELECT *, left(contents, 20) preveal, date_format(date, '%Y-%m-%d') s_date FROM message WHERE r_nick = ?";
        var params2 = [nick];
        connection.query(sql2, params2, function(err2, rows2) {
          if (err2) {
            console.log(err);
          }
          else {
            var id = req.session.user.id;
            var sql3 = "SELECT * FROM member WHERE member_id = ?";
            var params3 = [id];
            connection.query(sql3, params3, function(err3, rows0) {
              if (err3) {
                console.log(err);
              }
              else {
                res.render('profile', {
                  rows0: rows0,
                  rows1: rows1,
                  rows2: rows2
                });
              }
            });
          }
        });
      }
    });
  }
  else{
    //로그인하지 않은 경우
    res.send('<script>alert("로그인 해주세요!"); location.href = "/login";</script>');
  }
});

/* GET search pages */
router.get('/search', function(req, res) {
  var sql = "SELECT member_id, member_nick, member_msg, member_img FROM member ORDER BY RAND() LIMIT 5";
  // 회원 추천 및 검색 위해 현재 가입된 회원들 중 5명을 임의추출하여 정보 전달 (검색어를 입력하지 않고 아이콘을 클릭하여 들어왔을 경우)
  connection.query(sql, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.render('sub_search', {
        option: 1,
        keyword: "",
        rows: rows
      });
    }
  });
});

/* --------------------------------------------------------------------------- */
/* -------------------------- 페이지뷰 끝 (EJS 등록) --------------------------- */
/* --------------------------------------------------------------------------- */


/* --------------------------------------------------------------------------- */
/* -------------------------------- 기능 구현 --------------------------------- */
/* --------------------------------------------------------------------------- */

/* --------------------------- 컨텐츠 박스 이동 기능 --------------------------- */
router.post('/editPhoto', function(req, res) {
  var photos_x_pos = new Array();
  var photos_y_pos = new Array();
  var photo_name = new Array();
  // 사진 정보를 전달 받을 배열

  var visit_to = req.session.visit_to;
  var room_num = req.body.edit_room_num;
  
  photo_name = req.body.photos_name.split(',');
  photos_x_pos = req.body.photos_x_pos.split(',');
  photos_y_pos = req.body.photos_y_pos.split(','); // 배열에 넘겨준 값 저장
 
  var sql_crt = "CREATE VIEW room AS SELECT photo_name, x_pos, y_pos, width, height FROM photo WHERE member_id = ? AND room_num = ? ORDER BY date";
  var params_crt = [visit_to, room_num];
  connection.query(sql_crt, params_crt, function(err) {
    if (err) {
      console.log(err);
    } // 날짜 순으로 사진 정보 변경 하기 위해 view 생성 
    else {
      for (var i = 0; i < photo_name.length; i++) {
        var sql_udt = "UPDATE room SET x_pos = ?, y_pos = ? WHERE photo_name = ?";
        var params_udt = [photos_x_pos[i], photos_y_pos[i], photo_name[i]];
        connection.query(sql_udt, params_udt, function(err) {
          if (err) {console.log(err);}
        });
      } // 받은 사진 정보로 변경
      var sql_del = "DROP VIEW room";
      connection.query(sql_del, function (err) {
        if (err) {console.log(err);}
        else {
          console.log('삭제 까지 완료');
        }
      }); // 작업이 끝났으므로 view 삭제
    }
  });
  
  res.send ('<script>alert("변경 사항이 저장되었습니다!");</script>'+go_contents(visit_to, room_num));
}); // 사진 정보로 변경
/* -------------------------- 컨텐츠 박스 이동 기능 끝 -------------------------- */

/* --------------------------- 사진 세부 정보 수정 기능 --------------------------- */
router.post('/edit_detail_photo', function (req, res) {
  var visit_to = req.session.visit_to;
  var room_num = req.body.edit_room_num;
  var photo_name = req.body.edit_photo_name;

  var width = req.body.edit_photo_width;
  var height = req.body.edit_photo_height;

  if (req.body.mode==="edit") {
    var sql_udt = "UPDATE photo SET width = ?, height = ? WHERE member_id = ? AND photo_name = ? AND room_num = ?";
    var params_udt = [width, height, visit_to, photo_name, room_num];
    connection.query(sql_udt, params_udt, function(err) {
      if (err) {
        console.log(err);
        console.log('사진 변경 실패');
      }
      else {
        console.log('변경 완료');
        res.send ('<script>alert("변경 사항이 저장되었습니다!");</script>'+go_contents(visit_to, room_num));
      }
    });
  } // 변경을 눌렀을 때 사진 크기 변경
  else if (req.body.mode==="delete") {
    var sql_del = "DELETE FROM photo WHERE member_id = ? AND photo_name = ? AND room_num = ?";
    var params_del = [visit_to, photo_name, room_num];
    connection.query(sql_del, params_del, function(err) {
      if (err) {
        console.log('사진 삭제 실패');
      }
      else {
        console.log('삭제 완료');
        res.send ('<script>alert("사진이 삭제되었습니다!");</script>'+go_contents(visit_to, room_num));
      }
    });
  } // 삭제 눌렀을 때 사진 크기 삭제
}); // 사진 크기 변경 및 삭제
/* ------------------------- 사진 세부 정보 수정 기능 끝 ------------------------- */

/* ------------------------------- 회원 검색 기능 ------------------------------- */
router.post('/search', function(req, res) {
  var keyword = "%" + req.body.search + "%";
  var sql = 'SELECT member_id, member_nick, member_msg, member_img FROM member WHERE member_id LIKE ? OR member_nick LIKE ? OR member_email LIKE ? OR member_name LIKE ? OR member_msg LIKE ?';
  var params = [keyword, keyword, keyword, keyword, keyword];
  if(req.body.search == ""){
    //검색창에 아무것도 입력하지 않았을 경우 아이콘을 눌러 들어갔을 때와 동일하게 추천 모드로 작동 (회원 5명 임의추출)
    res.redirect('/search');
  }
  else{
    //검색창에 키워드를 입력한 경우 해당 키워드를 id나 닉네임에 포함하는 회원 검색
    connection.query(sql, params, function(err, rows, fields){
      if(err){
        console.log('검색 실패');
        res.send ('<script>alert("검색 도중 오류가 발생하여 검색을 취소합니다. 잠시후 이전 화면으로 이동합니다."); history.back();</script>');
      }
      else{
        console.log(keyword + '검색 성공');
        res.render('sub_search', {
          option: 2,
          keyword: req.body.search,
          rows: rows
        });
      }
    });
  }
});
/* ----------------------------- 회원 검색 기능 끝 ----------------------------- */

/* --------- 계정 관련 기능 (로그인, 로그아웃, 회원가입, 회원탈퇴 기능) --------- */
//참고 : 계정 관련 기능은 프로젝트 막바지에 Route 분리할 예정입니다. 소스 전체를 건드려야 하므로 1차 완성 이후에 하는 것으로 합시다. (/users 라우트 | 소스파일 -> users.js)

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
          res.send ('<script>alert("로그인 되었습니다!");</script>'+go_contents(req.session.user.id, 1));
        }
      }
      //일치하는 id,pw가 없음
      //추후 로그인 에러 페이지로 리다이렉트하는 것으로 변경을 검토
      res.send ('<script>alert("ID와 PW를 다시 확인하여 주십시오!"); location.href = "/login";</script>');
     }
  });
  //디버깅용 로그
  console.log(auth);
});

// 로그아웃 처리 알고리즘
router.get('/logout', function(req, res){
  req.session.destroy();
  console.log('로그아웃 처리 - 세션 삭제');
  res.redirect('/');
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
    res.send ('<script>alert("회원가입 양식의 모든 필드를 채워주셔야 합니다. 빈 칸은 허용되지 않습니다!"); location.href = "/register";</script>');
  }
  if(info.pw!=info.pwck){
    res.send ('<script>alert("비밀번호와 비밀번호 확인 필드의 값이 서로 다릅니다!"); location.href = "/register";</script>');
  }
  if(!RegExp1.test(info.phone)){
    res.send ('<script>alert("전화번호는 숫자만 입력하여 주십시오! ( - 는 생략해 주십시오.)"); location.href = "/register";</script>');
  }
  if(!RegExp2.test(info.mail)){
    res.send ('<script>alert("이메일 양식이 올바르지 않습니다! ( example@service.com 형식으로 입력해 주십시오)"); location.href = "/register";</script>');
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
         res.send ('<script>alert("아이디가 중복 됩니다!"); location.href = "/register";</script>');
       }
       if(rowss[i].member_nick == info.nick){
        console.log('닉네임 중복');
        res.send ('<script>alert("닉네임이 중복 됩니다!"); location.href = "/register";</script>');
       }
      }
        connection.query(sql, params, function(err, rows, fields){
           if(err){
            console.log(err);
            res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/register";</script>');
            return;
          }
          else {
            console.log(rows.insertId);
            fs.mkdirSync('uploads/'+info.id);
            fs.mkdirSync('uploads/'+info.id+'/1');
            fs.mkdirSync('uploads/'+info.id+'/2');
            fs.mkdirSync('uploads/'+info.id+'/3');
            console.log(info.id+' 폴더 생성');
            res.send ('<script>alert("회원가입 되었습니다! 로그인 하여 주십시오."); location.href = "/login";</script>');
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
      res.send ('<script>alert("2차 인증이 실패했습니다. ID와 PW를 다시 확인해 주십시오!"); location.href = "/profile";</script>');
    } //일치하는 id,pw가 없음
    else {
      console.log('회원탈퇴 처리 시작');
      //회원탈퇴 쿼리
      sql = 'DELETE FROM member WHERE member_id = ?';
      params_d = auth.id;
      connection.query(sql, params_d, function(err, result){
        if(err) {
          console.log('회원탈퇴 처리 실패 - ', err);
          res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/profile";</script>');
        }
        else {
          edit_msg_num(); // 쪽지 번호 갱신
          console.log('회원탈퇴 처리 완료' + result);
          req.session.destroy();
          res.send ('<script>alert("회원 탈퇴 되었습니다!"); location.href = "/";</script>');
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
      res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/finder";</script>');
    }
    else{
      for(var i=0; i<rows.length; i++){
        if(rows[i].member_email == auth.email){
          console.log('id조회 처리 시작');
          //email이 일치하는 member의 열에서 id 반환
          result = '<script>alert("해당 정보로 조회한 사용자의 ID는 ' + rows[i].member_id + ' 입니다."); location.href = "/login";</script>';
          res.send (result);
        }
      }
      //일치하는 id,pw가 없음
      res.send ('<script>alert("입력하신 내용과 일치하는 회원정보가 없습니다."); location.href = "/finder";</script>');
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
      res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/finder";</script>');
    }
    else{
      for(var i=0; i<rows.length; i++){
        if(rows[i].member_email == auth.email && rows[i].member_name == auth.name && rows[i].member_id == auth.id){
          console.log('pw조회 처리 시작');
          //email,성명,id가 일치하는 member의 열에서 pw 반환
          result = '<script>alert("해당 정보로 조회한 사용자의 PW는 ' + rows[i].member_pw + ' 입니다."); location.href = "/login";</script>';
          res.send (result);
        }
      }
      //일치하는 id,pw가 없음
      res.send ('<script>alert("입력하신 내용과 일치하는 회원정보가 없습니다."); location.href = "/finder";</script>');
    }
  });
});
/* ------------------------- 계정 관련 기능 끝 ------------------------- */

/* ------------------------- 회원 구독 기능 ------------------------- */

router.post('/subscribe', function(req, res) {

  if (!req.session.user) {
    res.send('<script>alert("로그인해야 사용할 수 있는 기능입니다!"); location.href = "/search";</script>');
    return;
  } // 로그아웃 시 기능 사용 제한

  var subInfo = {
    "s_id": req.session.user.id,
    "r_id": req.body.sub_r_id,
    "r_nick": req.body.sub_r_nick
  };
  
  var params_sel = [subInfo.s_id, subInfo.r_id];
  var sql_sel = "SELECT * FROM subscribe WHERE s_id = ? AND r_id = ?";
  connection.query(sql_sel, params_sel, function(err, rows, field) {
    if (err) {
      console.log(err);
    }
    else if (rows[0]!=undefined) {
      res.send('<script>alert("이미 구독했습니다!"); location.href = "/search";</script>');
      return;
    }
    else {
      var params_ins = [subInfo.s_id, subInfo.r_id, subInfo.r_nick];
      var sql_ins = "INSERT INTO subscribe(s_id, r_id, r_nick) values(?, ?, ?)";
      connection.query(sql_ins, params_ins, function(err, rows, field) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(subInfo+'\n'+'구독 성공');
          res.send('<script>alert("구독했습니다!"); location.href = "/search";</script>');
        }
      });
    }
  });

}); // 원하는 회원 구독 하는 기능 구현

// 구독 취소, 이동 기능
router.post('/move_and_remove', function(req, res) {
  var move = req.body.move;
  var remove = req.body.remove;
  var member = {
    "r_id": req.body.r_id
  }
  if (move=='move') {
    req.session.visit_to = member.r_id;
    res.send (go_contents(member.r_id, 1));
    return;
  }
  else if (remove=='remove') {
    var sql_del = 'DELETE FROM subscribe WHERE s_id = ? AND r_id = ?';
    var params_del = [req.session.user.id, member.r_id];
    
    connection.query(sql_del, params_del, function(err, rows, field) {
      if (err) {console.log(err)}
      else {
        res.send('<script>alert("구독을 취소했습니다!"); location.href = "/profile";</script>');
      }
    });
  }
});
 
/* ------------------------- 회원 구독 기능 끝 ------------------------- */

/* ------------------------- 쪽지 수발신 기능 ------------------------- */

router.post('/message', function(req, res) {

  if (!req.session.user) {
    res.send('<script>alert("로그인해야 사용할 수 있는 기능입니다!"); location.href = "/search";</script>');
    return;
  } // 로그아웃 시 기능 사용 제한

  if (req.body.msg_del) {
    var num = req.body.msg_del;
    var sql_del = 'DELETE FROM message WHERE num = ?';
    connection.query(sql_del, num, function(err) {
      if (err) {console.log(err);}
      else {
        console.log('삭제 성공!');
        res.send('<script>alert("쪽지를 삭제했습니다!"); location.href = "/profile";</script>');
      }
    });
  } // 쪽지 삭제일 경우
  else {
    if (req.body.msg_cont==="") {
      res.send('<script>alert("보낼 내용을 입력해주세요!"); location.href = "/search";</script>');
      return;
    } // 보낼 내용이 없을 때 예외 처리
  
    var msgInfo = {
      "r_nick": req.body.r_nick,
      "s_nick": req.session.user.nick,
      "contents": req.body.msg_cont
    } // DB에 삽입할 쪽지 내용
  
    var params_ins = [msgInfo.s_nick, msgInfo.r_nick, msgInfo.contents];
    var sql_ins = 'INSERT INTO message(s_nick, r_nick, contents) values(?, ?, ?)';
    connection.query(sql_ins, params_ins, function (err) {
      if (err) {console.log(err);}
      else {
        console.log('삽입 성공!');
        res.send ('<script>alert("쪽지를 보냈습니다!"); location.href = "profile";</script>');
      } // msg_info 내용을 message table에 삽입
    });
  } // 쪽지 보내기일 경우
  edit_msg_num(); // 쪽지 번호 갱신 함수
});

/* 함수 정의 */

function go_contents(login_go, r_num) {
  var contents_st = '<form id="sample" action="/contents" method="post">'
  +'<input style="display: none;" name="visit_to" type="text" value="'+login_go+'">'
  +'<input style="display: none;" name="room_num" type="text" value="'+r_num+'">'
  +'<input style="display: none;" type="submit" value="submit">'
  +'<script>document.getElementById("sample").submit();</script>';
  return contents_st;
} // 내 갤러리 또는 방문할 회원의 갤러리 정보를 넘김

function edit_msg_num() {
  var sql_udt1 = "ALTER TABLE message AUTO_INCREMENT = 1";
  connection.query(sql_udt1, function (err, rows, fields) {
    if (err) {
      console.log(err);
    }
    else {
      var sql_udt2 = "SET @count=0";
      connection.query(sql_udt2, function (err, rows, fields) {
        if (err) {
          console.log(err);
        }
        else {
          var sql_udt3 = "UPDATE message SET num = @count:=@count+1";
          connection.query(sql_udt3, function (err, rows, fields) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  }); // 쪽지 번호 갱신
}

/* ------------------------- 쪽지 수발신 기능 끝 ------------------------- */

/* ------------------------- 상태 메세지 수정 기능 시작 ------------------------- */
router.post('/personalmsg',  function(req, res){
  /* 변수 선언 */
  var user = req.session.user;
  var msg = req.body.p_msg
  var params_d = [msg,user.id];
  var sql = 'UPDATE member SET member_msg = ? WHERE member_id = ?';
  connection.query(sql, params_d, function(err, rows, fields){
    if(err) {
      console.log('상태 메세지 수정 실패 - ', err);
      res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/profile";</script>');
    }
    else {
      res.send ('<script>alert("상태 메세지가 수정 되었습니다!"); location.href = "/profile";</script>');
    }
  });
});
/* ------------------------- 상태 메세지 수정 기능 끝 ------------------------- */

/* ------------------------- 회원 정보 수정 기능 시작 ------------------------- */

router.post('/modify',  function(req, res){  
  /* 변수 선언 */
  var user = req.session.user;
  var authss = {
    "id": req.body.modi_id,
    "pw": req.body.modi_pw
  }
  //Mysql 쿼리 양식
  var sql = 'SELECT member_id FROM member WHERE member_id = ? AND member_pw = ?';
  var params_s = [authss.id, authss.pw];
  //검증 (세션정보의 id값으로 DB에서 비밀번호 조회)
  connection.query(sql, params_s, function(err, rows, fields){
     if(err) {
      console.log(err);
    }
    else if (rows[0] == undefined || authss.id != user.id) {
      res.send ('<script>alert("2차 인증이 실패했습니다. ID와 PW를 다시 확인해 주십시오!"); location.href = "/profile";</script>');
    } //일치하는 id,pw가 없음
    else {
      console.log('회원 정보 수정 시작');
      res.send('<script>location.href = "/profile?auth=1";</script>')
    }
  });
});

router.post('/remodify', function(req, res){ 
  var user = req.session.user;
  var remodif = {
    "pw": req.body.remodi_pw,
    "nick": req.body.remodi_nick,
    "email": req.body.remodi_email,
    "phone": req.body.remodi_phone
  }
  //양식 검증용 정규식
  var RegExp1 = /^[0-9]*$/;
  var RegExp2 = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
  //사용자가 입력한 회원정보변경 양식 검증
  if(remodif.pw==""||remodif.nick==""||remodif.email==""||remodif.phone==""){
    res.send ('<script>alert("회원정보변경 양식의 모든 필드를 채워주셔야 합니다. 변경하지 않을 정보는 원래 정보를 입력하십시오 (보안강화 차원의 조치입니다.) 빈 칸은 허용되지 않습니다!"); location.href = "/profile";</script>');
  }
  if(!RegExp1.test(remodif.phone)){
    res.send ('<script>alert("전화번호는 숫자만 입력하여 주십시오! ( - 는 생략해 주십시오.)"); location.href = "/profile";</script>');
  }
  if(!RegExp2.test(remodif.email)){
    res.send ('<script>alert("이메일 양식이 올바르지 않습니다! ( example@service.com 형식으로 입력해 주십시오)"); location.href = "/profile";</script>');
  }
  else{
    var sql = 'UPDATE member SET member_pw = ?, member_nick = ?, member_email = ?, member_phone = ? WHERE member_id = ?';
    params_m = [remodif.pw, remodif.nick, remodif.email, remodif.phone, user.id];
    connection.query(sql, params_m, function(err, rows, fields){
      if(err) {
        console.log('회원 정보 수정 실패 - ', err);
        res.send ('<script>alert("서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오."); location.href = "/profile";</script>');
      }
     else {
        console.log('회원 정보 수정 완료');
        req.session.user.nick = remodif.nick;
        res.send ('<script>alert("회원 정보가 수정 되었습니다!"); location.href = "/profile";</script>');
      }
    });
  }
});
/* ------------------------- 회원 정보 수정 기능 끝 ------------------------- */

/* --------------------------------------------------------------------------- */
/* ------------------------------- 기능 구현 끝 -------------------------------- */
/* --------------------------------------------------------------------------- */

module.exports = router;