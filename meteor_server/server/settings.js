Meteor.startup(function() {
  Meteor.methods({
    setConfig: function (fields) {
      console.log(fields);
      ConfigDB.upsert({}, fields)
    },
    getConfig: function() {
      message = {
        flag: "getConfig",
      }
      //flag for when frontend requests a log
      if(localIdentConn["goserver"])
        localIdentConn["goserver"].send(JSON.stringify(message))
    }
  })
})
