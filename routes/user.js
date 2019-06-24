var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
const crypto = require("crypto");

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
//유저 데이터 확인
router.get("/userdata", function (req, res) {
    //var query = "select * from Idol_user where email = ?"
    var query = "select * from Idol_user";
    getConnection().query(query, (err,result,fields)=> {
        if (err) throw err;
        res.send(result);
    });

});
//회원가입 페이지 이동
router.get('/sign_up', function(req, res) {
    
    fs.readFile('./public/sign_up.html', 'utf-8', function (error, data) {
    res.send(data)
})
});

//로그인 페이지 이동
router.get('/login', function(req, res) {
    //res.render(req.seccion)
    fs.readFile('./public/login.html', 'utf-8', function (error, data) {
    res.send(data)
})
});

router.post("/sign_up", function(req,res){
   
    var body = req.body;

    let inputPassword = body.password;
    //let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword).digest("hex");

    var queryString = 'insert into Idol_user(email,password) values (?,?)';
    getConnection().query(queryString, [body.userEmail,hashPassword], function () {
        res.redirect('/userdata');
    })
});
// 로그인창 
router.post("/login", function(req,res){
    var body = req.body;
    var queryString = 'select * from Idol_user where email = ?';
    var dbPassword;
    //let salt 
    getConnection().query(queryString, body.userEmail, function (error, result) {
        //res.send(result[0].password);
        dbPassword = result[0].password;

        let inputPassword = body.password;
        let hashPassword = crypto.createHash("sha512").update(inputPassword).digest("hex");

        if(dbPassword === hashPassword){
            console.log("비밀번호 일치");
            // 세션 설정
            //req.session.email = body.userEmail;
            // 쿠키 설정
            res.cookie("Idol_user", body.userEmail , {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            }); 
            res.redirect("/pasing/1");
        }
        else{
            console.log("비밀번호 불일치");
            console.log("test"+hashPassword);
            console.log(dbPassword);
            res.redirect("/login");
        }
    })

        
   
});

module.exports = router;