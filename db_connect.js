var mysql = require('mysql');

var con = mysql.createConnection({
    host: "wikifactsdb.cqjtdtczzjan.eu-west-2.rds.amazonaws.com",
    user: "admin",
    password: process.env.WIKI_DB_PASSWORD,
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});