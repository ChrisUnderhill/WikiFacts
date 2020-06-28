const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const {spawn} = require("child_process");
const crypto = require('crypto')

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json())

app.use(function (req,res,next) {
    console.log("GOT A REQUEST");
    console.log(req.body);
    console.log();
    next();
});

app.post('/api/login', function (req, res) {
    console.log(req.body);
    if (req.body.username === "Simon") {
        res.status(401)
        return res.send("lolNope!");
    }
    else if (req.body.username === "Chris"){
        return res.send("Hello!");
    }
    else {
        res.status(401)
        return res.send("No such user!");
    }
});

app.post('/api/register', function (req, res) {
    console.log(req.body);
    if (req.body.username === "Simon") {
        res.status(401)
        return res.send("lolNope!");
    }
    else if (req.body.username === "Chris"){
        return res.send("Hello!");
    }
    else {
        res.status(418)
        return res.send("Failed to Register!");
    }
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

//testing webhook yayayay
