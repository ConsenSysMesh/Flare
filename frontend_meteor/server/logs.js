Meteor.startup( function(){
  Meteor.methods({
    getLog: function (type) {
      message = {
        flag: "getLog",
        type: type
      }
      //flag for when frontend requests a log
      if(localWS)
        localWS.send(JSON.stringify(message))
    }
  })
})
