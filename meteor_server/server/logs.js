Meteor.startup( function(){
  Meteor.methods({
    getLog: function (type) {
      message = {
        flag: "getlog",
        type: type
      }
      //flag for when frontend requests a log
      if(localIdentConn["goserver"])
        localIdentConn["goserver"].send(JSON.stringify(message))
    }
  })
})
