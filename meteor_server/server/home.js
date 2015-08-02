var home = Meteor.bindEnvironment(function () {
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

    exec(confJSON.cassandra.directory+'/bin/nodetool info', Meteor.bindEnvironment(function(err, out, code) {
      var keyRegex = /.*(?=\s*:.*)/g
      var keys = out.match(keyRegex)
      var valueRegex = /:.*/g
      var values = out.match(valueRegex)
      if (keys == null)
        return
      var data = {}
      params=out.split("\n")
      for(i=0; i< params.length; i++) {
        if(params[i].match(keyRegex) == null)
          break
        var key = params[i]
          .match(keyRegex)[0]
          .trim()
        var value = params[i]
          .match(valueRegex)[0]
          .replace(":","")
          .trim()

        data[key] = value
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

    exec('ipfs config show', Meteor.bindEnvironment(function(err, out, code) {
      if (err) {
        //TODO: create a graceful way to display all the configuration errors
        //console.log("ipfs threw the following error, make sure it's enabled with the correct ports");
        //console.log(err);
        return
      }
      var IPFSResponse = JSON.parse(out)
      var peerID = IPFSResponse.Identity.PeerID
      var status = 'ALIVE'
      var address = IPFSResponse.Addresses.Swarm

      //TODO: Callback in callback...not pretty but it works. Need to learn promises
      HTTP.get('http://127.0.0.1:5001/api/v0/id', function(error, response) {
        if(response) {
          var publicKey = response.data.PublicKey
          var obj = {
            ID: peerID,
            status: "ALIVE",
            address: address,
            publicKey: publicKey
          }
          IPFSDB.upsert({},{$set: obj})
        }
      })
    }))

})
Meteor.startup(function(){
  setInterval(home, 5000)
  })
