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
        console.log(req.params.id)
        var queryString = 'insert into reply(review_id,comment) values (?,?)';
        //var queryString2 = 'delete from reply where review_id';
        //body.memo
            getConnection().query(queryString, [req.params.id,body.memo], function () {
                res.redirect('/pasing/'+ 1);
            })
    });


  module.exports = router;