var express = require ('express');
var app = express();
var mysql = require('mysql');

var bodyParser =require("body-parser");
app.use(bodyParser.urlencoded({
    extended:false
}));

app.get('/',function(req,res){
    res.sendFile('index.html',{root:__dirname});

})

app.post('/submit-student-data',function (req,res){
    var name=req.body.firstName + '' +req.body.lastName ;
    res.send(name + 'submitted successfully');
});

var server =app.listen (5000,function(){
    console.log("node server is running ....")
});
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});