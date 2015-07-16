var http = require('http');
var cheerio = require('cheerio');

module.exports = function(server){

  var WebSocketServer = require('websocket').server;
  var fs = require('fs');
  var shell = require('shelljs');
  var identConn = {};
  var http = require('http');

//This is used to grab the HTML of Spark and IPFS
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
}

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
	connection.sendUTF('connection established');
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

        if(data.flag = "logdata")
        {
          if(data.success == true && identConn["frontend"])
            console.log(data.text.escapeSpecialChars());
            identConn["frontend"].sendUTF('{"flag": "logdata", "success": true, "text": "'+data.text+'"}')
        }

		if(data.flag = "homepage read"){
			console.log("connection from homepage success!");
			if(data.success == true && identConn["frontend"])
				console.log(data.text.escapeSpecialChars());
				identConn["frontend"].sendUTF('{"flag": "homepage", "success": true, "text": "hello world!"}');
				var sparkURL = "http://localhost:8080/";
				download(sparkURL, function(data){
					if(data){
						var $ = cheerio.load(data);	
						$("ul.unstyled").each(function(i,e){
							var tag = $(e).find("li ").each(function(i,e){
								console.log($(e).text().trim().replace(/(\r\n|\n|\r)/gm,""));
							});
						});
					}
					else{
						console.log("error");
					}
				});

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
