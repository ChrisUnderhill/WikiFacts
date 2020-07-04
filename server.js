const express = require('express');
const session = require('express-session')
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
        user: "newuser",
        password: "password",
        multipleStatements: true,
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

app.use(session({
    'secret': '343ji43j4n3jn4jk3n'
}))

app.use(bodyParser.json())

app.use(function (req,res,next) {
    console.log(new Date().toString() +"|\tGot a request for " + req.url);
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
        "SELECT * FROM users WHERE name=?", [req.body.username], (err, data) => {
            if (err || !data || data.length!==1) {
                res.status(401);
                res.send("No");
            } else {
                if (bcrypt.compareSync(req.body.password, data[0].HASH.toString())){
                    req.session.username = req.body.username;
                    console.log(data[0])
                    req.session.userid = data[0].ID;
                    res.send("yay!\n" + JSON.stringify(req.session))
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
        [req.body.username, hash],
        (err) => {
            if (err) {
                res.status(500);
                res.send("No");
            }
            else {
                res.send("Successfully registered")
            }
        }
    )
    // TODO no duplicate usernames
});

app.get('/api/session', function (req, res) {
    res.send(req.session)
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

    console.log("Checksum for update ", checksum)

    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        res.status(404)
        res.send();
        return;
    }

    res.status(200)
	let updateSite = spawn("bash", ["/home/ec2-user/updateSite.sh"])
    res.send()
});

app.post('/api/score', function (req, res) {
   if (!req.session.username) {
       res.send("cool story bro")
       return;
   }
   let confidence = req.body.confidence;
   if (!confidence) {
       res.status(400)
       res.send("Bad request")
   }
    let correctness = req.body.correct;
    con.query("SELECT * FROM scores WHERE USERID=? AND CONFIDENCE=?",
       [req.session.userid, confidence],
       (err, data) => {
            if (err){
                throw err;
            }
            if (data.length === 0){
                con.query("INSERT INTO scores SET ?",
                    {
                        USERID: req.session.userid,
                        CORRECT: 0 + correctness,
                        WRONG: 1 - correctness,
                        CONFIDENCE: confidence
                    },
                    err => {if (err) throw err}
                )
                return;
            }
            let oldCorrect = data[0].CORRECT;
            let oldWrong = data[0].WRONG;
            if (correctness) {
                con.query("UPDATE scores SET CORRECT=? WHERE USERID=? AND CONFIDENCE=?",
                    [oldCorrect + 1, req.session.userid, confidence], (err) => {
                    if (err) {
                        throw err;
                    }
                    })
            } else {
                con.query("UPDATE scores SET WRONG=? WHERE USERID=? AND CONFIDENCE=?",
                    [oldWrong + 1, req.session.userid, confidence], (err) => {
                        if (err) {
                            throw err;
                        }
                    })
            }
       })
    res.send("Success");
});

const react_paths=["/","/play", "/login", "/register", "/account"]

app.get('/*', function (req, res) {
    if (!react_paths.includes(req.originalUrl)){
        res.status(404);
    }
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 5000);

