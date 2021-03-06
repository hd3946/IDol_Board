var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')
var bodyParser = require('body-parser');

//mysql db 연결 함수
/*
<img src= "<%= test2 %>">
<img src= "<%= test3 %>">
<img src='http://localhost:4000/images/<%= item.image %>'>  
*/           
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'mylist',
    password: '3973'
})



//디비 연결 함수
function getConnection() {
    return pool
}


//게시판 페이징

router.get("/pasing/:cur", function (req, res) {

    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;

    var queryString = 'select count(*) as cnt from review'
    getConnection().query(queryString, function (error2, data) {
        if (error2) {
            console.log(error2 + "메인 화면 mysql 조회 실패");
            return
        }
        //전체 게시물의 숫자
        totalPageCount = data[0].cnt

        //현제 페이지
        var curPage = req.params.cur;

        console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


        //전체 페이지 갯수
        if (totalPageCount < 0) {
            totalPageCount = 0
        }

        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


        //현재페이지가 0 보다 작으면
        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        }

        console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };


        fs.readFile('./public/list.html', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            console.log("몇번부터 몇번까지냐~~~~~~~" + no)

            var queryString = 'select * from review order by reviewid desc limit ?,?';
            getConnection().query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    data: result,
                   // test1: result[0].user,
                    //test1: mysql.escape(new Buffer(result[0].image,'binary').toString("base64")),
                    //test2: new Buffer(result.image,'binary').toString("utf-8"),
                   // test3: new Buffer(result[0].image,'binary').toString("base64"), 되는거
                    pasing: result2
                }));
            });
        });


    })

})


//json 값 확인 
router.get("/main", function (req, res) {
    console.log("json형태")
    //main 으로 들어오면 바로 페이징 처리
    //res.redirect('/pasing/' + 1)
    //json
    var query = "select * from review";
    getConnection().query(query, (err,result,fields)=> {
        if (err) throw err;
        res.send(result);
    });

});
//이미지 

router.get("/imgs", function (req, res) {
    console.log("이미지 띄우기")
    var query = "select * from review";
    getConnection().query(query, (err,result,fields)=> {
        if (err) throw err;
        res.send(result);
    });
})



//삭제
router.get("/delete/:id", function (req, res) {
    console.log("삭제 진행")

    getConnection().query('delete from review where reviewid = ?', [req.params.id], function () {
        res.redirect('/pasing/1')
    });

})


//수정 페이지
router.get("/edit/:id", function (req, res) {
    console.log("수정 진행")

    fs.readFile('./public/edit.html', 'utf-8', function (error, data) {
        getConnection().query('select * from review where reviewid = ?', [req.params.id], function (error, result) {
            //res.send(result);
             res.send(ejs.render(data, {     
                data: result[0]
             }))
        })
    });

})
//수정 포스터 데이터
router.post("/edit/:id", function (req, res) {
    console.log("수정 포스트 진행")
    var body = req.body;
    console.log(body)
    getConnection().query('update review set user = ?, memo = ? where reviewid = ?',
        [body.title, body.memo, req.params.id], function () {
            res.redirect('/pasing/1')
            //res.redirect('/main')
        })
})


//글상세보기
router.get("/detail/:id", function (req, res) {
    console.log("글상세보기")
    fs.readFile('./public/detail.html', 'utf-8', function (error, data) {
        if (error) {
            console.log("ejs오류" + error);
            return
        }
    
        //var queryString = 'select * from review where reviewid = ?';
        var commentquery = 'SELECT * FROM review Left JOIN reply ON review.reviewid=reply.review_id WHERE review.reviewid=?'
        
        getConnection().query(commentquery, [req.params.id], function (error, result) {
            if (error) {
                console.log("에러" + error);
                return
            }
            //res.send(result);
               res.send(ejs.render(data, {
                 test: result     
               }));
        })
        
    });
})

module.exports = router
