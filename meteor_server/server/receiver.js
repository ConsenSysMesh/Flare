function receiverWS(data,localIdentConn) {
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
