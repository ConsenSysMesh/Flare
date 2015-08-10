var settings = Meteor.bindEnvironment(function () {

  //check for new configs only once
  if(localWS && ConfigDB.findOne() == null)
    localWS.send(JSON.stringify({flag: "getConfig"}))
})

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

//TODO: don't hardcode, subscribe and have go send config when it changes
  setInterval(settings, 5000)
})
