const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json())

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

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);