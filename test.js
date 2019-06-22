const express = require('express');
const mysql = require('mysql');
const app = express();

app.listen('8080', ()=> {
    console.log("Server Started");
});

var dbc = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "3973",
        database: "gundamdb"
});

dbc.connect((err) => {
    if (err) throw err;
    console.log("Database Connected");
});

app.get('/',(req, res)=> {
    var query = "select * from gundam";
    dbc.query(query, (err,result,fields)=> {
        if (err) throw err;
        res.send(result);
    });
});
app.get('/select',(req, res)=> {
    var query = `select * from gundam where id=${req.query.id}`;          //중요
    dbc.query(query, (err,result,fields)=> {
        if (err) throw err;
        res.send(result);
    });
});