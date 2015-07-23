Meteor.startup(function(){
  JARSDB.find().observeChanges({
    added: function(id, fields) {
      exec(
        confJSON.spark.directory+'/bin/spark-submit ' +
        '--properties-file '+filesDirectory+'deployment.conf '+
        '--class DDAppTemplate '+'"'+filesDirectory+"jar/"+ fields["name"]+'"', {async: true, silent: true});

      JARSDB.update(id,{state: "complete"})
    }
  })
})



function submitWS(data,localIdentConn) {
  var masterAdd = data.text.sparkMasterAddress;
  var cassAdd = data.text.cassAddress;
  var cassUname = data.text.cassUsername;
  var cassPass = data.text.cassPassword;

  confJSON.sparkMasterAddress = masterAdd;
  confJSON.cassAddress = cassAdd;
  confJSON.cassUsername = cassUname;
  confJSON.cassPassword = cassPass;


  var text = JSON.stringify(confJSON, null, 4);
  //TODO: renable this after the presentation June-7-2015
  /*fs.writeFile(flareConf, text, function(err){
    if(err){
      console.log(err);
    }
    else {
      console.log('confJSON modified');
    }
  });*/
  var response = '{"flag": "submit", "success": "config"}';
  localIdentConn["submit"].sendUTF(response);
}
