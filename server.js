const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const {spawn} = require("child_process");
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
    console.log(req.body)
    console.log(process.env.UPDATE_SECRET)
    if (req.body.auth === process.env.UPDATE_SECRET) {
        res.status(200)
	updateSite = spawn("bash", ["/home/ec2-user/updateSite.sh"])
        return res.send(req.body);
    }
    else {
        res.status(404)
	res.send()
    }
});

const react_paths=["/","/play", "/login", "/register"]

app.get('/*', function (req, res) {
    if (!react_paths.includes(req.originalUrl)){
        res.status(404);
    }
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 5000);
