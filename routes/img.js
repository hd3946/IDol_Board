var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const multer = require("multer");
const path = require("path");

var fs = require('fs')

//mysql db 연결 함수

var dbc = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'mylist',
    password: '3973'
})

var time = Date.now();

//디비 연결 함수
function getConnection() {
    return dbc
}

let storage = multer.diskStorage({
    destination: function(req, file ,callback){
      callback(null, "public/images/")
    },
    filename: function(req, file, callback){
      let extension = path.extname(file.originalname);
      let basename = path.basename(file.originalname, extension);    
      callback(null, time + basename + extension);
    }
  })
  
  let upload = multer({
    storage: storage
  })
  

  
//삽입 포스터 데이터
router.post("/insert", upload.single("image"), function(req, res, next) {
    console.log("삽입 포스트 데이터 진행")
    let file = req.file
  
    let result = {
      originalName :  time + file.originalname,
      size : file.size,
    }
  
    //res.json(result);

    var body = req.body;

    getConnection().query('insert into review(user,memo,image) values (?,?,?)', [body.user, body.memo, result.originalName], function () {
        //응답
        res.redirect('/main');
    })

})
  
 
  
  
  module.exports = router;