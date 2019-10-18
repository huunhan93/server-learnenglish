var express = require("express");
var app = express();

//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
//Using JSON
app.use(bodyParser.json())
//Cors
var cors = require('cors')
app.use(cors())
//postgresql
var { Pool } = require("pg");
var pool = null;
const connectionString = 'postgres://vgjtpjmubfripr:d73f2f53ba4c037b40a5847364b535b17386ac0ce0aa068c091bb976dfe6c344@ec2-54-204-37-92.compute-1.amazonaws.com:5432/d8vgti02tvffbm'

function connectPG() {
    // pool = new Pool({
    //     user: 'vgjtpjmubfripr',
    //     host: 'ec2-54-204-37-92.compute-1.amazonaws.com',
    //     database: 'd8vgti02tvffbm',
    //     password: 'd73f2f53ba4c037b40a5847364b535b17386ac0ce0aa068c091bb976dfe6c344',
    //     port: 5432,
    // });
    pool = new Pool({
        connectionString: connectionString,
        ssl: true
    })
}

app.listen(process.env.PORT || 3002);

app.get('/', function(req, res){
    res.send('Hello world!')
})

app.get("/getword", function (req, res) {
    connectPG();
    pool.query('SELECT * FROM public.word', (err, resPG) => {
        if (err) {
            res.json({ err: err })
        } else {
            res.json({ "kq": resPG.rows })
        }
        pool.end()
    })
})
app.post("/insertword", function(req, res){
    var en = req.body.En;
    var vn = req.body.Vn;
    connectPG();
    pool.query(`INSERT INTO public.word(
        "En", "Vn", "IsMemorized")
        VALUES ( '`+en+`', '`+vn+`', true);`, (err, resPG) => {
        if (err) {
            res.json({ "kq": 0 }) // Thêm thất bại
        } else {
            res.json({ "kq": 1 }) // Thêm thất bại
        }
        pool.end()
    })
})
app.post("/updateword", function (req, res) {
    var id = req.body.Id;
    connectPG();
    pool.query(`UPDATE public.word
	SET "IsMemorized"= not "IsMemorized"
	WHERE "Id" = `+ id + `;`, (err, resPG) => {
        //console.log(err, res)
        if (err) {
            res.json({ "kq": 0 }) // Cập nhật thất bại
        } else {
            res.json({ "kq": 1 }) // Cập nhật thành công
        }
        pool.end()
    })
});

app.post("/deleteword", function (req, res) {
    //res.send("Hello world 1!");
    var id = req.body.Id;
    connectPG();
    pool.query(`DELETE FROM public.word
	WHERE "Id" = `+id+`;`, (err, resPG) => {
        //console.log(err, res)
        if (err) {
            res.json({ "kq": 0 }) // Xóa thất bại
        } else {
            res.json({ "kq": 1 }) // xóa thành công
        }
        pool.end()
    })
})