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

  localWS.on('message', Meteor.bindEnvironment( function(message) {
    console.log('Flare Received Message: ' + message.escapeSpecialChars());

    var data = JSON.parse(message.escapeSpecialChars())

    //flag for when goserver responds with the requested log data
    if (data.flag == "log"){
      switch (data.type) {
        case "sparkUI":
        SparkDB.upsert({},{sparkUILog: data.text})
        break;
        case "spark":
        SparkDB.upsert({},{sparkLog: data.text})
        break;
        case "tracing":
        CassandraDB.upsert({},{tracingLog: data.text})
        break;
        case "session":
        CassandraDB.upsert({},{systemLog: data.text})
        break;
        default:
      }
    }
  }))
})
