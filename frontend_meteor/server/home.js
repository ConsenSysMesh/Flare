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

  //Use the cassandra nodetool to get state information
  exec(confJSON.cassandra.directory+'/bin/nodetool info', Meteor.bindEnvironment(function(err, out, code) {
    var data = {}
    params=out.split("\n")
    //iterate through every line of output, skipping the last blank line
    for(i=0; i< params.length-1; i++) {
      param = params[i].split(":")
      var key = param[0].trim()
      var val = param[1].trim()
      data[key] = val
    }

    var obj = {
      ID: data["ID"],
      gossipActive: data["Gossip active"],
      thriftActive: data["Thrift active"],
      uptime: data["Uptime (seconds)"],
      heapMemory: data["Heap Memory (MB)"]
    }

    CassandraDB.upsert({},{$set: obj})
  }))

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
  //TODO: stop from consuming CPU
  setInterval(home, 5000)
})
