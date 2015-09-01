var home = Meteor.bindEnvironment(function () {
  //Get the SparkUI and parse it for info
  var sparkURL = "http://localhost:8080";
  HTTP.get(sparkURL, function(error, response){
    if(response) {
      var $ = cheerio.load(response.content);
      $("ul.unstyled").each(function(i,e) {
        $(e).find("li").each(function(i,e) {
          var raw = $(e).text().replace(/(\r\n|\n|\r|\t)/g,"")
          //console.log(raw);
          var key = raw.split(":")[0]
          var value = raw.split(":")[1]
          var obj = {}
          obj[key] = value
          SparkDB.upsert({},{$set: obj})
        })
      })
    }
  })

  //call the IPFS REST API for state information
  HTTP.get('http://127.0.0.1:5001/api/v0/id', function(error, response) {
    if(response) {
      var id = response.data.ID
      var publicKey = response.data.PublicKey
      var obj = {
        id: id,
        status: "ALIVE",
        publicKey: publicKey
      }
      IPFSDB.upsert({},{$set: obj})
    }
  })
})

Meteor.startup(function(){
  setInterval(home, 5000)

  localWS.on('message', Meteor.bindEnvironment( function(message) {
    console.log('Flare Received Message: ' + message.escapeSpecialChars());

    var data = JSON.parse(message.escapeSpecialChars())

    if (data.flag == "cassandraNodeInfo")
      CassandraDB.upsert({}, {$set: JSON.parse(data.text)})
  }))
})
