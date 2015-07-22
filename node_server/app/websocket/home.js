var http = require('http');
var shell = require('shelljs');
var fs = require('fs');
var flareConf = process.env.FLARECONF;
var confJSON = require(flareConf);
var cheerio = require('cheerio');

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

module.exports = function(data,localIdentConn) {
  if(data.text == "spark"){
    var sparkURL = "http://localhost:8080";
    download(sparkURL, function(data){
      if(data){
        var $ = cheerio.load(data);
        $("ul.unstyled").each(function(i,e){
          var tag = $(e).find("li ").each(function(i,e){
            var response = $(e).text().replace(/(\r\n|\n|\s|\t)/gm,"")
            var message = {}
            message.flag = "spark"
            message.success = true
            message.text = response
            localIdentConn["frontend"].sendUTF(JSON.stringify(message));
          });
        });
      }
      else{
        console.log("error");
      }
    });
    return
  }

  if(data.text == "IPFS"){
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
        localIdentConn["frontend"].sendUTF('{"flag": "IPFS", "success": true, "text": '+IPFSResponse+'}');
      });

    });
  }

  if(data.text == "cass"){
    //without the async tag, it doesn't work...
    shell.exec(confJSON.cassandra.directory+'/bin/nodetool info > ' + confJSON.flare.directory + '/app/node_server/files/cassandra.txt');
    var cassResponse = "";
    var ID = "";
    var gossipActive = "";
    var thriftActive = "";
    var uptime = "";
    var heapMemory = "";

    fs.readFile(confJSON.flare.directory+'/app/node_server/files/cassandra.txt', 'utf8', function(err, data){
      if(err || data == undefined){
        return
      }
      cassResponse = data.replace(/(\r\n|\r|\s|\t)/g,"");
      ID = cassResponse.substring(cassResponse.indexOf("ID")+3, cassResponse.indexOf("Gossip"));
      gossipActive = cassResponse.substring(cassResponse.indexOf("Gossipactive:")+13, cassResponse.indexOf("Thrift"));
      thriftActive = cassResponse.substring(cassResponse.indexOf("Thriftactive:")+13, cassResponse.indexOf("NativeTransp"));
      upTime = cassResponse.substring(cassResponse.indexOf("(seconds):")+10, cassResponse.indexOf("Heap"));
      heapMemory = cassResponse.substring(cassResponse.indexOf("(MB):")+5, cassResponse.indexOf("Off"));
      cassResponse = '{"cassID": "' + ID + '", "cassGossipActive": "' + gossipActive + '", "cassThriftActive": "' + thriftActive + '", "cassUptime": "' + upTime+ '", "cassHeapMemory": "' + heapMemory + '"}';
      localIdentConn["frontend"].sendUTF('{"flag": "cass", "success": true, "text": '+cassResponse+'}');
      //console.log(cassResponse);

    });
  }
}
