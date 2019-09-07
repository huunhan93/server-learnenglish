var express = require("express");
var app = express();

//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : false}));
//Using JSON
app.use(bodyParser.json())

//postgresql
var {Pool, Client} = require("pg");
var pool = null;
function connectPG(){
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'LearnEnglish',
        password: '1234',
        port: 5432,
    });
    pool.connect();
}
var client = null
function connectHeruku(){
    client = new Client({
        connectionString: "postgres://ykivkgdyulhufk:4d7a42853cce3e3ffc5cd1a90a7f065dac6b39d3ab7398e414523458cd12a11d@ec2-54-83-9-36.compute-1.amazonaws.com:5432/dc70rv58a5kbtb",
        ssl: true,
      });
      client.connect();
}

app.listen(process.env.PORT || 3002);

app.get("/getword", function(req, res){
    //res.send("Hello world 1!");
    connectHeruku();
    var query = "SELECT * FROM word";
    client.query(query, function(err, resPG){
        if(err) {
            res.json({"err" : err})
            
        }else{
            res.json({"arrWord" : resPG.rows})
        }
        
        client.end();
    });
    
})