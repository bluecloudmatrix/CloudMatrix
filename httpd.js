/**
 * Created by qiushan on 4/5/2016.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

//var exec = require('child_process').exec;

var shell = require("shelljs");

app.get('/', function(req, res){
    res.send('<h1>The Docker Cloud Realtime Server</h1>');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on("deploy", function(data) {
        //var term = JSON.stringify(data);
	//console.log("receiving data: " + term);
	//console.log("receiving data: " + data.timestamp);
	
	//var child = exec('echo hello ' + term, function(err, stdout, stderr) {
        //    if (err) throw err;
        //    console.log(stdout);
        //});

        //shell.exec("docker run -d -P mymongodb");
        //shell.exec("./lparctl.sh create -f hello.json");

	//console.log(data.text.service_name);
	//console.log(data.text.image_name);
	fs.writeFileSync('./JSON/createTmp.json', JSON.stringify(data.text));	
	shell.exec("./onectl.sh create -f ./JSON/createTmp.json");	
	

        shell.exec("./grabContainersInfo.sh");
        var containers = require("./JSON/containers.json");
        var t = containers[getRandomInRange(0, containers.length-1, 0)];
	//console.log(t);
  	data.text = t;
        socket.emit("serverResponse", data);
    });

    socket.on("services", function(data) {
        shell.exec("./grabContainersInfo.sh");
	var containers = require("./JSON/containers.json");
	data.text = containers;
	socket.emit("servicesListing", data);    
    });

});

http.listen(10002, function(){
    console.log('listening on *:10002');
});


function getRandomInRange(from, to ,fixed) {
  return (Math.random()*(to-from)+from).toFixed(fixed)*1;
}
