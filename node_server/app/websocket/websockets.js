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
    4
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
          require("./home.js")(data,localIdentConn)
        }

        if(data.flag == "connections") {
          require("./connections.js")(data,localIdentConn)
        }

        if(data.flag == "receiver"){
          require("./receiver.js")(data,localIdentConn)
        }

        if(data.flag == "submit"){
          require("./submit.js")(data,localIdentConn)
        }
      }
      else if (message.type === 'binary') {
        var fileName = 'DDApp.jar';
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        fs.writeFile(confJSON.flare.directory+'/node_server/app/files/' + fileName, message.binaryData, function(err){
          if (err) {
            console.log(err);
            throw err
          }
          console.log("File is saved: " + fileName);

          //Place spark submit to the network
          console.log(confJSON.spark.directory+'/bin/spark-submit ' +
          '--properties-file '+confJSON.flare.directory+'/node_server/app/files/deployment.conf '+
          '--class DDAppTemplate '+confJSON.flare.directory+'/node_server/app/files/' + fileName);

          shell.exec(
            confJSON.spark.directory+'/bin/spark-submit ' +
            '--properties-file '+confJSON.flare.directory+'/node_server/app/files/deployment.conf '+
            '--class DDAppTemplate '+confJSON.flare.directory+'/node_server/app/files/' + fileName, {async: true, silent: true});

          var response = '{"flag": "submit", "success": "jar"}';
          localIdentConn["frontend"].sendUTF(response);

          //TODO: Contact ethereum network, add new receiver to list
          //if ethereum network registers the receiver
          response = '{"flag": "submit", "success": "success"}';
          localIdentConn["frontend"].sendUTF(response);
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
      console.log("reasonCode"+reasonCode);
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
}
