var http = require('http');
var shell = require('shelljs');
var fs = require('fs');
var cheerio = require('cheerio');
var flareConf = process.env.FLARECONF;
var confJSON = require(flareConf);

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

  if(data.text == "ipfs"){
    var child = shell.exec('ipfs swarm peers', {async: true, silent: true});
    child.stdout.on('data', function(data){
      peerArray = data.split(/\n+/);
      for( i = 0; i < 10; i++){
        localIdentConn["frontend"].sendUTF('{"flag": "ipfs", "success": true, "text": "'+peerArray[i]+'"}');
      }
    });
  }

  if(data.text == "cass"){
    shell.exec(confJSON.cassandra.directory+'/bin/nodetool ring > '+confJSON.flare.directory+'/node_server/app/files/cassandra_ring.txt');
    var cassAddress = "";
    var cassStatus = "";
    var cassState = "";
    var cassOwns = "";
    var cassToken = "";
    fs.readFile(confJSON.flare.directory+'/node_server/app/files/cassandra_ring.txt', 'utf8', function(err, data){
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
}
