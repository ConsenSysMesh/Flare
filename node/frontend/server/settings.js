Meteor.startup(function() {
  ConfigDB.find().observeChanges({
    changed: function(id, fields){
      var message = {
        flag: "setConfig",
        text: JSON.stringify(ConfigDB.findOne())
      }
      console.log(message);
      if(localWS)
        localWS.send(JSON.stringify(message))
    }
  })
  Meteor.methods({
    setConfig: function (fields) {
      ConfigDB.upsert({}, fields)
    }
  })

  localWS.on('open', Meteor.bindEnvironment( function() {
      localWS.send(JSON.stringify({flag: "getConfig"}))
  }))
})
