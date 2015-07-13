var WebSocketServer = require('websocket').server;
var fs = require('fs');
var shell = require('shelljs');

module.exports = function(server){
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
    console.log(request);
    var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
    //var fileName = '';
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
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
