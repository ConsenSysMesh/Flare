var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var flareConf = process.env.FLARECONF;
var confJSON = require(flareConf);

module.exports = function(server){

  var WebSocketServer = require('websocket').server;
  var fs = require('fs');
  var shell = require('shelljs');
  var identConn = {};
  var http = require('http');

//This is used to grab Spark data
  function download(url, callback) {
  	http.get(url, function(res) {
  	  	var data = "";
  	  	res.on('data', function (chunk) {
  	  	  	data += chunk;
  	  	});
  	  	res.on("end", function() {
  	  	  	callback(data);
  	  	});
  	}).on("error", function() {
  	  	callback(null);
  	});
};

  String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "\\\\n")
               .replace(/\\'/g, "\\\'")
               .replace(/\\"/g, '\\\"')
               .replace(/\\&/g, "\\\&")
               .replace(/\\r/g, "\\\r")
               .replace(/\\t/g, "\\\\t")
               .replace(/\\b/g, "\\\b")
               .replace(/\\f/g, "\\\f");
  };

  wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    maxReceivedFrameSize:64*1024*1024, 	//64MiB
    maxReceivedMessageSize: 64*1024*1024, //64MiB
    autoAcceptConnections: false
  });

  function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
	connection.send('{"success": true}');
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data.escapeSpecialChars());

        var data = JSON.parse(message.utf8Data.escapeSpecialChars())

        if (data.flag == "identify") {
          identConn[data.name] = connection
          return
        }

        if(data.flag == "getlog") {
          if(identConn["goserver"]) {
            identConn["goserver"].sendUTF(message.utf8Data)
          }
          return
        }

        if(data.flag == "logdata")
        {
          if(data.success == true && identConn["frontend"])
            console.log(data.text.escapeSpecialChars());
            identConn["frontend"].sendUTF('{"flag": "logdata", "success": true, "text": "'+data.text+'"}')
        }

		if(data.flag == "homepage" && data.text == "spark"){
			var sparkURL = "http://localhost:8080";
			download(sparkURL, function(data){
				if(data){
					var $ = cheerio.load(data);	
					$("ul.unstyled").each(function(i,e){
						var tag = $(e).find("li ").each(function(i,e){
							var response = $(e).text().replace(/(\r\n|\n|\s|\t)/gm,"")
							identConn["frontend"].sendUTF('{"flag": "spark", "success": true, "text": "'+response+'"}');
						});
					});
				}
				else{
					console.log("error");
				}
			});
			return
		}

		if(data.flag == "homepage" && data.text == "IPFS"){
			//without the async tag, it doesn't work...
          	var child = shell.exec('ipfs config show', {async: true, silent: true});
			var IPFSResponse = "";
			var peerID = "";
			var currentStatus = "";
			var swarmAddress = "";
			var publicKey = "";
			child.stdout.on('data', function(data){
				IPFSResponse = JSON.parse(data);
				peerID = IPFSResponse.Identity.PeerID;
				currentStatus = 'ALIVE';
				swarmAddress = IPFSResponse.Addresses.Swarm;
				
				//Callback in callback...not pretty but it works. Need to learn promises
          		child2= shell.exec('curl http://127.0.0.1:5001/api/v0/id', {async: true, silent: true});
				child2.stdout.on('data', function(data){
					publicKey = JSON.parse(data).PublicKey;	
					IPFSResponse = '{"peerID": "' + peerID + '" , "currentStatus": "ALIVE", "swarmAddress": "' + swarmAddress + '", "publicKey": "'+ publicKey + '"}';
					identConn["frontend"].sendUTF('{"flag": "IPFS", "success": true, "text": '+IPFSResponse+'}');
				});

			});
		}

		if(data.flag == "homepage" && data.text == "cass"){
			//without the async tag, it doesn't work...
			shell.exec(confJSON.cassDirectory+'/bin/nodetool info > ' + confJSON.flareDirectory + '/node_server/files/cassandra.txt');
			var cassResponse = "";
			var ID = "";
			var gossipActive = "";
			var thriftActive = "";
			var uptime = "";
			var heapMemory = "";

			fs.readFile(confJSON.flareDirectory+'/node_server/files/cassandra.txt', 'utf8', function(err, data){
				if(err){
					console.log(err);
				}
				cassResponse = data.replace(/(\r\n|\r|\s|\t)/g,"");
				ID = cassResponse.substring(cassResponse.indexOf("ID")+3, cassResponse.indexOf("Gossip"));
				gossipActive = cassResponse.substring(cassResponse.indexOf("Gossipactive:")+13, cassResponse.indexOf("Thrift"));
				thriftActive = cassResponse.substring(cassResponse.indexOf("Thriftactive:")+13, cassResponse.indexOf("NativeTransp"));
				upTime = cassResponse.substring(cassResponse.indexOf("(seconds):")+10, cassResponse.indexOf("Heap"));
				heapMemory = cassResponse.substring(cassResponse.indexOf("(MB):")+5, cassResponse.indexOf("Off"));
				cassResponse = '{"cassID": "' + ID + '", "cassGossipActive": "' + gossipActive + '", "cassThriftActive": "' + thriftActive + '", "cassUptime": "' + upTime+ '", "cassHeapMemory": "' + heapMemory + '"}';
				identConn["frontend"].sendUTF('{"flag": "cass", "success": true, "text": '+cassResponse+'}');
				//console.log(cassResponse);

			});
		}

		if(data.flag == "connections" && data.text == "spark"){
			var sparkURL = "http://localhost:8080";
			//TODO: Take this out in the future, still need to implement this part.
            identConn["frontend"].sendUTF('{"flag": "spark", "success": true, "text": "hello world!"}');
			download(sparkURL, function(data){
				if(data){
					var $ = cheerio.load(data);	
					$("table.table").each(function(i,e){
						var tag = $(e).find("td").each(function(i,e){
							var response = $(e).text().replace(/(\r\n|\n|\s|\t)/gm,"")
							//to be implemented
							//identConn["frontend"].sendUTF('{"flag": "spark", "success": true, "text": "'+response+'"}');
						});
					});
				}
				else{
					console.log("error");
				}
			});
			return
		}
		if(data.flag == "connections" && data.text == "ipfs"){
          	var child = shell.exec('ipfs swarm peers', {async: true, silent: true});
			child.stdout.on('data', function(data){
				peerArray = data.split(/\n+/);
				for( i = 0; i < 10; i++){
					identConn["frontend"].sendUTF('{"flag": "ipfs", "success": true, "text": "'+peerArray[i]+'"}');
				}
			});
		}
		if(data.flag == "connections" && data.text == "cass"){
			shell.exec(confJSON.cassDirectory+'/bin/nodetool ring > '+confJSON.flareDirectory+'/node_server/files/cassandra_ring.txt');
			var cassAddress = "";
			var cassStatus = "";
			var cassState = "";
			var cassOwns = "";
			var cassToken = "";
			fs.readFile(confJSON.flareDirectory+'/node_server/files/cassandra_ring.txt', 'utf8', function(err, data){
				if(err){
					console.log(err);
				}
				var rowArray = data.split(/\n+/);
				for( i = 6; i < 17; i++){
					var response = '{"flag": "cass", "success": true, "text": {';
					var columnArray = rowArray[i].split(/\s+/);
					response += '"cassAddress": "' + columnArray[0] + '", ';
					response += '"cassStatus": "' + columnArray[2] + '", ';
					response += '"cassState": "' + columnArray[3] + '", ';
					response += '"cassOwns": "' + columnArray[6] + '", ';
					response += '"cassToken": "' + columnArray[7] + '"}} ';
        	    	identConn["frontend"].sendUTF(response);
					response = "";
				}
			});
		}
		if(data.flag == "receiver"){
        	var memory = data.text.memory;
			var cores = data.text.cores;
			var address = data.text.address;
			var price = data.text.price;

			confJSON.receiverMemory = memory;
			confJSON.cores = cores;
			confJSON.address = address;
			confJSON.price = price;
			var text = JSON.stringify(confJSON, null, 4);
			//flareConf
			fs.writeFile(flareConf, text, function(err){
				if(err){
					console.log(err);
				}
				else {
					console.log('confJSON modified');
				}
			});
			//console.log(text);
			//TODO: Contact ethereum network, add new receiver to list
			var response = '{"flag": "receiver", "success": true }';
			//if ethereum network registers the receiver
        	identConn["receiver"].sendUTF(response);
		}

        var messageArr = message.utf8Data.split('|');
        var configString = '';
        if(messageArr[0] == 'config'){
          for (i = 1; i < messageArr.length; i++){
            configString += messageArr[i] + '\n';
          }
          console.log(configString);
          fs.writeFile('./files/deployment.conf', configString, function(err){
            if(err) throw err;
            connection.sendUTF('config transferred');
          });
        }
        fileName = message.utf8Data;
      }
      else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
        console.log();
        fs.writeFile('./files/' + fileName, message.binaryData, function(err){
          if (err) throw err;
          console.log("File is saved: " + fileName);
          fileName = '';
          //Place spark submit in here
          //shell.exec('');
          connection.sendUTF('jar transferred');
        });
      }
    });
    connection.on('close', function(reasonCode, description) {
      console.log(reasonCode);
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
}
