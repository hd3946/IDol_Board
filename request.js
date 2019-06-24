const http = require('http');
var request = require('request');
var express = require('express')
var mysql = require('mysql')


http.createServer((req,res)=> {
    res.writeHead(200,{'Content-Type' : 'application/json'});

    var pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        database: 'mylist',
        password: '3973'
    })
    
    function getConnection() {
        return pool
    }
    
    var query = "select * from review";
    getConnection().query(query,(err,result,fields)=> {
        if(err) throw err;
        //res.end(JSON.stringify(result));
    });
}).listen(8080);
console.log("server start");

var url = "https://www.naver.com";
var options = {
    hostname: 'httpbin.org',
    path: '/post',
    method: 'POST',
    headers: {
      'Content-Type': 'text/html',
    }
  };

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (body) {
      //console.log('Body: ' + body);
    });
  });

request(url,function(err,res,body){
    req.write(
        '{"text": "test string"}'
    );
    req.end();
})
