var connections = Meteor.bindEnvironment(function () {
  ///TODO: Potentially use the spark ui logs instead, potentially scan using go
  var sparkURL = "http://localhost:8080";
  HTTP.get(sparkURL, function(error, response){
    if(response){
      var $ = cheerio.load(response.content)

      var master = {}
      var title = $('h3').text()
      //remove the link to extract the title
      var titleText = title.replace($('h3 a').text(), "")
      //parse out the address portion
      master.address = titleText.trim().split(" ")[3]

      var nodes = []
      var nodeArray = $('table.table tr').get().map(function(row) {
        return $(row).find('td').get().map(function(cell) {
          return $(cell).text();
        });
      });
      $(nodeArray).each(function(i,e){
        nodes.push({
          ID: e[0].replace(/(\s)/g,""),
          address: e[1],
          state: e[2],
          cores: e[3],
          memory: e[4].replace(/(\s+)/g," ")
        })
      })
      SparkDB.upsert({}, {$set: {connections: {master:master, nodes: nodes}}})
    }
  })

  var ipfsPeers = exec('ipfs swarm peers', Meteor.bindEnvironment( function(err, out, code){
    IPFSDB.upsert({}, {$set: {connections: out.split("\n")}})
  }))
})
Meteor.startup(function(){

  setInterval(connections, 5000)
  localWS.on('message', Meteor.bindEnvironment( function(message) {
    console.log('Flare Received Message: ' + message.escapeSpecialChars());

    var data = JSON.parse(message.escapeSpecialChars())

    if (data.flag == "cassandraNodeRing") {
      CassandraDB.upsert({}, {$set: {connections: JSON.parse(data.text)}})
    }
  }))
})
