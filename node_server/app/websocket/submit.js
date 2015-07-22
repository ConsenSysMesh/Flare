var http = require('http');
var fs = require('fs');
var flareConf = process.env.FLARECONF;
var confJSON = require(flareConf);

module.exports = function(data,localIdentConn) {
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
