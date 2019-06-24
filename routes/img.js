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
  
//삽입 페이지
router.get("/insert", function (req, res) {
  console.log("삽입 페이지 나와라")
  fs.readFile('./public/insert.html', 'utf-8', function (error, data) {
      res.send(data)
  })

})

//삽입 포스터 데이터  
router.post("/insert",upload.single("image"), function(req, res, next) {
    console.log("삽입 포스트 데이터 진행")
    let file = req.file
    
     var dog = {
      //image: fs.readFileSync("D:\\d.jpg"),
      imagetest: fs.readFileSync("D:\\APM_Setup\\htdocs\\index\\"+file.path),
    };
    
    var body = req.body;
    //res.json(body);
    console.log(dog.imagetest) 
    var queryString = 'insert into review(user,memo,image) values (?,?,?)'
    getConnection().query(queryString, [body.user, body.memo, dog.imagetest] , function (result) {
      //res.json(result);
      //응답
      res.redirect('/pasing/1');
    })

})
  

module.exports = router;