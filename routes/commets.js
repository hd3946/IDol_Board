var express = require('express')
var router = express.Router()
var mysql = require('mysql')
const path = require("path");

var fs = require('fs')
var ejs = require('ejs')

//mysql db 연결 함수

var dbc = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'mylist',
    password: '3973'
})

//디비 연결 함수
function getConnection() {
    return dbc
}

//json 값 확인 
router.get("/show", function (req, res) {
    console.log("json형태")
    
    var query = "select * from reply";
    getConnection().query(query, (err,result,fields)=> {
        if (err) throw err;
        res.send(result);
    });

});

//댓글 입력
router.post("/posts/:id/comments", function (req, res) {
    console.log("댓글입력")

    var body = req.body;
    var queryString = 'insert into reply(reviewid,memo) values (?,?)';

          getConnection().query(queryString, [req.params.id,body.memo], function () {
            res.redirect('/detail/'+ 1);
          })
});

//댓글 띄우기
router.get("/detail/:id/tttt", function (req, res) {
    console.log("댓글띄우기")
    fs.readFile('./public/detail.html', 'utf-8', function (error, data) {
        if (error) {
            console.log("ejs오류" + error);
            return
        }
    
        var queryString = 'select * from reply where reviewid = ?';
        getConnection().query(queryString, [req.params.id], function (error, result) {      
           
            // res.send(ejs.render(data,{
            //     cdata: result
            // }))
        })

    });
    
});
  
  module.exports = router;