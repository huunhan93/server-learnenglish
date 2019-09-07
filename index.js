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
        connectionString: "postgres://xediuqruedbglt:d08ef8a0864d91b3f406709fe3c5f6ac4dc1c8b6bf389eb8bd0edc7365d2457f@ec2-23-21-148-223.compute-1.amazonaws.com:5432/d518t1utp6ndsi",
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