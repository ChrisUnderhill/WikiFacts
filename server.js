const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const {spawn} = require("child_process");
const crypto = require('crypto')
var bcrypt = require('bcryptjs');
var mysql = require('mysql');
const fs = require('fs');

const app = express();


let useDB = false;
try {
    var con = mysql.createConnection({
        host: "localhost",
        multipleStatements: true
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to MySQL!");
        fs.readFile('createdb.sql', 'utf8', (err, data) => {
            if (err) throw err;
            else {
                con.query(data);
                useDB = true;
            }
        });
    });
} catch {
    console.log("Database is sad :(")
}

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json())

app.use(function (req,res,next) {
    console.log("GOT A REQUEST");
    console.log(req.body);
    console.log();
    next();
});

app.use(function (req, res, next) {
    try {
        next();
    } catch (err) {
        res.status(500);
        res.send("Server error");
        console.warn(err);
    }
})

app.post('/api/login', function (req, res) {
    if (!useDB){
        res.status(500);
        res.send("Database error");
    }
    console.log(req.body);
    if (!(req.body.username && req.body.password)){
        res.status(400);
        res.send("That's not how you login");
        return;
    }
    con.query(
        "SELECT * FROM users WHERE name=?", [req.body.username], (err, res) => {
        if (err || !res || res.length!==1) {
            res.status(401);
            res.send("No");
        } else {
            if (bcrypt.compareSync("B4c0/\/", res[0].hash)){
                res.send("yay!")
            } else {
                res.status(401);
                res.send("No");
            }
        }
    });
});

app.post('/api/register', function (req, res) {
    if (!useDB){
        res.status(500);
        res.send("Database error");
    }
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    if (!(username && password)) {
        res.status(400);
        res.send("That's not how you register")
        return;
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    con.query(
        "INSERT INTO users (name, hash) VALUES (?, ?)",
        [req.body.username, req.body.password],
        (err) => {
            if (err) {
                res.status(500);
                res.send("No");
            }
        }
    )
    // TODO no duplicate usernames
});

app.post('/api/update', function (req, res) {
    const payload = JSON.stringify(req.body)
    if (!payload) {
        res.status(404)
        res.send();
        return;
    }
    const sig = req.get("X-Hub-Signature") || ''
    const hmac = crypto.createHmac('sha1', process.env.UPDATE_SECRET)
    const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
    const checksum = Buffer.from(sig, 'utf8')

    console.log("sig, ", sig)
    console.log("hmac, ", hmac)
    console.log("digest, ", digest)
    console.log("checksum, ", checksum)

    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        res.status(404)
        res.send();
        return;
    }

    res.status(200)
	let updateSite = spawn("bash", ["/home/ec2-user/updateSite.sh"])
    res.send()
});

const react_paths=["/","/play", "/login", "/register"]

app.get('/*', function (req, res) {
    if (!react_paths.includes(req.originalUrl)){
        res.status(404);
    }
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 5000);

