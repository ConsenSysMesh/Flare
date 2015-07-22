var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var flareConf = process.env.FLARECONF;
var confJSON = require(flareConf);

module.exports = function(localServer, masterServer){

  var WebSocketServer = require('websocket').server;
  var shell = require('shelljs');

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

  localWSServer = new WebSocketServer({
    httpServer: localServer,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    maxReceivedFrameSize:64*1024*1024, 	//64MiB
    maxReceivedMessageSize: 64*1024*1024, //64MiB
    autoAcceptConnections: false
  });

  masterWSServer = new WebSocketServer({
    httpServer: masterServer,
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

  var localIdentConn = {};
  localWSServer.on('request', function(request) {
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
        console.log('Flare Received Message: ' + message.utf8Data.escapeSpecialChars());

        var data = JSON.parse(message.utf8Data.escapeSpecialChars())

        if (data.flag == "identify") {
          localIdentConn[data.name] = connection
          return
        }

        //flag for when frontend requests a log
        if(data.flag == "getlog") {
          if(localIdentConn["goserver"])
            localIdentConn["goserver"].sendUTF(message.utf8Data)
          return
        }

        //flag for when goserver responds with the requested log data
        if(data.flag == "logdata")
        {
          if(data.success == true && localIdentConn["frontend"])
          console.log(data.text.escapeSpecialChars());
          var message = {}
          message.flag = "logdata"
          message.success = true
          message.text = data.text
          localIdentConn["frontend"].sendUTF(JSON.stringify(message))
        }

        if(data.flag == "processPayment") {
          if(localIdentConn["frontend"])
            localIdentConn["frontend"].sendUTF(message.utf8Data)
          return
        }

        if(data.flag == "homepage") {
          require("./home.js")(data)
        }

        if(data.flag == "connections" && data.text == "spark"){
          var sparkURL = "http://localhost:8080";
          //TODO: Take this out in the future, still need to implement this part.
          localIdentConn["frontend"].sendUTF('{"flag": "spark", "success": true, "text": "hello world!"}');
          download(sparkURL, function(data){
            if(data){
              var $ = cheerio.load(data);
              $("table.table").each(function(i,e){
                var tag = $(e).find("td").each(function(i,e){
                  var response = $(e).text().replace(/(\r\n|\n|\s|\t)/gm,"")
                  //to be implemented
                  //localIdentConn["frontend"].sendUTF('{"flag": "spark", "success": true, "text": "'+response+'"}');
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
              localIdentConn["frontend"].sendUTF('{"flag": "ipfs", "success": true, "text": "'+peerArray[i]+'"}');
            }
          });
        }
        if(data.flag == "connections" && data.text == "cass"){
          shell.exec(confJSON.cassandra.directory+'/bin/nodetool ring > '+confJSON.flare.directory+'/app/node_server/files/cassandra_ring.txt');
          var cassAddress = "";
          var cassStatus = "";
          var cassState = "";
          var cassOwns = "";
          var cassToken = "";
          fs.readFile(confJSON.flare.directory+'/app//node_server/files/cassandra_ring.txt', 'utf8', function(err, data){
            if(err || data == undefined){
              return
            }
            var rowArray = data.split(/\n+/);
            for( i = 6; i<rowArray.length && i < 17; i++){
              var response = '{"flag": "cass", "success": true, "text": {';
              var columnArray = rowArray[i].split(/\s+/);
              response += '"cassAddress": "' + columnArray[0] + '", ';
              response += '"cassStatus": "' + columnArray[2] + '", ';
              response += '"cassState": "' + columnArray[3] + '", ';
              response += '"cassOwns": "' + columnArray[6] + '", ';
              response += '"cassToken": "' + columnArray[7] + '"}} ';
              localIdentConn["frontend"].sendUTF(response);
              response = "";
            }
          });
        }

        if(data.flag == "receiver"){
          var memory = data.text.memory;
          var cores = data.text.cores;
          var address = data.text.address;
          var price = data.text.price;

          confJSON.flare.receiverMemory = memory;
          confJSON.flare.cores = cores;
          confJSON.flare.address = address;
          confJSON.flare.price = price;
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
          //TODO: Contact ethereum network, add new receiver to list
          var response = '{"flag": "receiver", "success": true }';
          //if ethereum network registers the receiver
          localIdentConn["receiver"].sendUTF(response);
        }

        if(data.flag == "submit"){
          var masterAdd = data.text.sparkMasterAddress;
          var cassAdd = data.text.cassAddress;
          var cassUname = data.text.cassUsername;
          var cassPass = data.text.cassPassword;

          confJSON.sparkMasterAddress = masterAdd;
          confJSON.cassAddress = cassAdd;
          confJSON.cassUsername = cassUname;
          confJSON.cassPassword = cassPass;

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
          var response = '{"flag": "submit", "success": "config"}';
          localIdentConn["submit"].sendUTF(response);
        }
      }
      else if (message.type === 'binary') {
        var fileName = 'DDApp.jar';
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        fs.writeFile('./files/' + fileName, message.binaryData, function(err){
          if (err) throw err;
          console.log("File is saved: " + fileName);
          fileName = '';
          //Place spark submit in here
          //shell.exec('');
          var response = '{"flag": "submit", "success": "jar"}';
          localIdentConn["submit"].sendUTF(response);
          //TODO: Contact ethereum network, add new receiver to list
          //if ethereum network registers the receiver
          response = '{"flag": "submit", "success": "success"}';
          localIdentConn["submit"].sendUTF(response);
        });
      }
    });
    connection.on('close', function(reasonCode, description) {
      console.log(reasonCode);
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });

  var masterIdentConn = {};
  masterWSServer.on('request', function(request) {

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
        console.log('Spark Master Received Message: ' + message.utf8Data.escapeSpecialChars());

        var data = JSON.parse(message.utf8Data.escapeSpecialChars())

        if (data.flag == "identify") {
          masterIdentConn[data.name] = connection
          return
        }

        if(data.flag == "processPayment") {
          if(masterIdentConn["frontend"])
            masterIdentConn["frontend"].sendUTF(message.utf8Data)
          return
        }

      }
    });
    connection.on('close', function(reasonCode, description) {
      console.log(reasonCode);
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
}
