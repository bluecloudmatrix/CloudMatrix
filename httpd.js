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

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

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
	//shell.exec("./onectl.sh create -f ./JSON/createTmp.json");	
	shell.exec("./onectl");	
	//sleep(1000, function() {
   	// executes after one second, and blocks the thread
   	//});
   
	
        shell.exec("./grabContainersInfo.sh");
        	
	delete require.cache[require.resolve("./JSON/containers.json")];
	var containers = require("./JSON/containers.json");
        //var t = containers[getRandomInRange(0, containers.length-1, 0)];
	var t = containers[0];
	//console.log(t);
  	data.text = t;
        socket.emit("serverResponse", data);
    });
	
    socket.on("sign", function(data) {
        var username = data.username;
	var password = data.password;
	console.log(username);
	console.log(password);
	shell.exec("htpasswd -b /data/progrmas/docker/nginx/registry.password " + username + " " + password);	
	socket.emit("signStatus", "success");
    });    

    socket.on("services", function(data) {
        shell.exec("./grabContainersInfo.sh");
	delete require.cache[require.resolve("./JSON/containers.json")];
	var containers = require("./JSON/containers.json");
	console.log(containers);
	data.text = containers;
	socket.emit("servicesListing", data);    
    });

    socket.on("remove", function(data) {
	shell.exec("./removeContainer");
	shell.exec("rm -rf /var/lib/docker/volumes/*");	
        shell.exec("./grabContainersInfo.sh");
	delete require.cache[require.resolve("./JSON/containers.json")];
	var containers = require("./JSON/containers.json");
	data.text = containers;
	socket.emit("removeListing", data);    
    });
});

http.listen(10002, function(){
    console.log('listening on *:10002');
});


function getRandomInRange(from, to ,fixed) {
  return (Math.random()*(to-from)+from).toFixed(fixed)*1;
}
