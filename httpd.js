/**
 * Created by qiushan on 4/5/2016.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//var exec = require('child_process').exec;

var shell = require("shelljs");

app.get('/', function(req, res){
    res.send('<h1>z-Cluster Realtime Server</h1>');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on("deploy", function(data) {
        var term = data.toLowerCase();
        console.log("deploy term: " + term);
        //var child = exec('echo hello ' + term, function(err, stdout, stderr) {
        //    if (err) throw err;
        //    console.log(stdout);
        //});
        shell.exec("echo jekins hello again " + term);
    });
});

http.listen(10002, function(){
    console.log('listening on *:10002');
});
