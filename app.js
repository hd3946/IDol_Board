//모듈 임포트
var express = require('express');
var app = express()
var morgan = require('morgan') //로그 모듈 임포트
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(session({
    key: 'sid', 
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
  }))
//key                 : 세션의 키 값
//secret             :  세션의 비밀 키, 쿠키값의 변조를 막기 위해서 이 값을 통해 세션을 암호화 하여 저장
//resave             : 세션을 항상 저장할 지 여부 (false를 권장)
//saveUninitialized : 세션이 저장되기전에 uninitialize 상태로 만들어 저장
//cookie             : 쿠기 설정
app.use(bodyParser.urlencoded({ extended: true }));

//미들웨어 설정
app.use(morgan('short')) //로그 미들웨어
app.use(express.static('./public')) //기본 파일 폴더 위치 설정
//라우트로 분리시켜주기
var imgRouter = require('./routes/img.js')
var userRouter = require('./routes/user.js')
var comments = require('./routes/commets.js')
//게시판~!
var productRouter = require('./routes/products.js')

app.use(productRouter)
app.use(imgRouter)
app.use(comments)
app.use(userRouter)
app.use('./upload', express.static('images'))
app.use(cookieParser());

//var PORT = process.env.PORT || 3003
//서버 가동
app.listen(4000, function () {
    console.log("서버가동")
})
