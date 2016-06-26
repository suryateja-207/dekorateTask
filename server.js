var mongoose = require('mongoose');
var express = require('express');
var http = require('http');
var routes = require('./routes');

var app	    = express();
mongoose.connect('mongodb://localhost/dekorateTask');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers" ,"Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE,GET,HEAD,POST,PUT,OPTIONS,TRACE");
    next();
});

app.use('/', routes);

var conn = mongoose.connection;

conn.once("open", function () {
    console.log("Mongodb connected");
    var httpServer = http.createServer(app);
    httpServer.listen('8080', function () {
        console.log('Listening for place orders on: 8080');
    });
});

conn.on('error', function(error) {
    console.log(error);
});

//Handle uncaught exceptions
process.on('uncaughtException', function (err) {
    console.log(err.stack);
});
