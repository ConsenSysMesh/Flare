var settings = Meteor.bindEnvironment(function () {

  //check for new configs only once
  if(localIdentConn["goserver"] && ConfigDB.findOne() == null)
    localIdentConn["goserver"].send(JSON.stringify({flag: "getConfig"}))
})

Meteor.startup(function() {
  ConfigDB.find().observeChanges({
    changed: function(id, fields){
      var message = {
        flag: "setConfig",
        text: JSON.stringify(ConfigDB.findOne())
      }
      console.log(message);
      if(localIdentConn["goserver"])
        localIdentConn["goserver"].send(JSON.stringify(message))
    }
  })
  Meteor.methods({
    setConfig: function (fields) {
      console.log("setConfig");
      ConfigDB.upsert({}, fields)
    }
  })

//TODO: don't hardcode, subscribe and have go send config when it changes
  setInterval(settings, 5000)
})
