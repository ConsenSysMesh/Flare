Meteor.startup(function(){
  JARSDB.find().observeChanges({
    added: function(id, fields) {
      message = {
        id: id,
        flag: "sparkSubmit",
        class: "DDAppTemplate",
        name: filesDirectory+"jar/"+ fields["name"]
      }
      //flag for when frontend requests a log
      localWS.send(JSON.stringify(message))
    }
  })

  localWS.on('message', Meteor.bindEnvironment( function(message) {
    console.log('Flare Received Message: ' + message.escapeSpecialChars());

    var data = JSON.parse(message.escapeSpecialChars())
    if(data.flag == "sparkSubmit")
      if(data.success == true)
        JARSDB.update(data.id,{state: "completed"})
      else
        JARSDB.update(data.id,{state: "failed"})
  }))
})
