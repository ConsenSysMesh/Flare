Meteor.startup(function () {
  var WebSocketServer = Meteor.npmRequire('ws').Server
  var Transaction = Meteor.npmRequire('ethereumjs-tx');
  var utils = Meteor.npmRequire('ethereumjs-util')
  masterWSServer = new WebSocketServer({
    host: "127.0.0.1",
    port: 35384,
    path: "/master"
  }) //35384 is 'fleth' (flare ethereum) on keypads
  masterWSServer.on('connection', Meteor.bindEnvironment(function(connection) {
    connection.on('message', Meteor.bindEnvironment(function(message) {
      console.log('Spark Master Received Message: ' + message);
      var data = JSON.parse(message)

      if(data.flag == "processPayment") {
        //console.log("got payment")

        var fromAddress = "af8b2d3fe28201476fc0a3961f8f9690693f3ef4"
        var toAddress = data.address
        var value = 50*data.operations; //lightwallet sends in units of eth
        var url = "http://stablenet.blockapps.net/query/account"+"?address="+fromAddress
        HTTP.call("GET",url, function(error, response) {
          var data = JSON.parse(response.content)

          var privateKey = new Buffer('e9c29ed4be8e74ad1f6c91ccd424f771bd94020d36e2330e844bf3370f374eb0', 'hex');

          var rawTx = {
            nonce: data.nonce,
            gasPrice: "09184e72a000",
            gasLimit: "2710",
            to: data.address,
            value: "00",
            data: ""
          };

          var tx = new Transaction(rawTx);
          tx.sign(privateKey);

          var serializedTx = {
            from : tx.getSenderAddress().toString('hex'),
            nonce : utils.bufferToInt(tx.nonce),
            gasPrice : utils.bufferToInt(tx.gasPrice),
            gasLimit : utils.bufferToInt(tx.gasLimit),
            to : toAddress.toString('hex'),
            value : utils.bufferToInt(tx.value).toString(),
            codeOrData : (tx.data).toString('hex'),
            r : (tx.r).toString('hex'),
            s : (tx.s).toString('hex'),
            v : (tx.v).toString('hex'),
            hash : tx.hash().toString('hex')
          }

          //console.log(serializedTx);

          var url = "http://stablenet.blockapps.net/includetransaction"
          HTTP.call("POST",url, {data: serializedTx}, function(error, response) {
          })
        })
      }
    }))
  }))
})
