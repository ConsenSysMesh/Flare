contract('Market', function(accounts) {
  var market = null;

  String.prototype.hexEncode = function(){
    var hex="";
    for (var i=0; i<this.length; i++) {
      hex += this.charCodeAt(i).toString(16)
    }

    return hex
  }

  String.prototype.hexDecode = function () {
    var str = '';
    for (var i = 2; i < this.length; i += 2) {
      var check = parseInt(this.substr(i, 2), 16)
      if(check == "00")
      break
      str += String.fromCharCode(check)
    }
    return str;
  }

  before(function(done) {
    market = Market.at(Market.deployed_address);
    return done();
  });
  it("should not permit creating dapps without a master", function(done) {
    return market.createDApp("dapp1", 200)
    .then(function() {
      return market.startDApp("dapp1");
    })
    .then(function() {
      return market.dapps.call("dapp1");
    })
    .then(function(dapp) {
      assert.isFalse(dapp[4], "Market was created with no nodes")
      return done();
    })
  });
  it("should get node state and ip", function(done) {
    return market.createNode("node1", "online", "127.0.0.1")
    .then(function() {
      return market.nodes.call("node1");
    })
    .then(function(node) {
      var hexstate = "online".hexEncode()
      assert.strictEqual(hexstate, node[1].substring(2,14), "Contract data created incorrectly")

      var hexip = "127.0.0.1".hexEncode()
      assert.strictEqual(hexip, node[2].substring(2,20), "Contract data created incorrectly")
      return done();
    })
  })

  it("should add multiple nodes", function(done) {
    return market.createNode("node2", "online", "127.0.0.1")
    .then(function () {
      return market.createNode("node3", "online", "127.0.0.1")
    })
    .then(function () {
      return market.createNode("node4", "online", "127.0.0.1")
    })
    .then(function () {
      return market.createNode("node5", "online", "127.0.0.1")
    })
    .then(function() {
      return market.numNodes.call();
    })
    .then(function(data) {
      assert.strictEqual(data.c[0], 5, "Contract data created incorrectly")
      return done();
    })
  })

  it("should get dapps fee", function(done) {
    return market.createDApp("marke1", 200)
    .then(function() {
      return market.dapps.call("marke1");
    })
    .then(function(dapp) {
      var fee = 200
      assert.strictEqual(fee, dapp[2].c[0], "Contract data created incorrectly")
      return done();
    })
  });
  it("should set a master node", function(done) {
    return market.createNode("marketer1", "online", "127.0.0.1")
    .then(function () {
      return market.createDApp("marke1", 200)
    })
    .then(function() {
      return market.dapps.call("marke1");
    })
    .then(function(dapp) {
      var hexstate = "marketer1".hexEncode()
      assert.strictEqual(hexstate, dapp[1].substring(2,20), "Contract data created incorrectly")
      return done();
    })
  });
  it("should let master start dapps", function(done) {
    return market.createNode("marketer1", "online", "127.0.0.1")
    .then(function () {
      return market.createDApp("dapp1", 200)
    })
    .then(function() {
      return market.startDApp("dapp1");
    })
    .then(function() {
      return market.dapps.call("dapp1");
    })
    .then(function(dapp) {
      assert.isTrue(dapp[4], "Contract data created incorrectly")
      return done();
    })
  });
  return it("should make other nodes become workers", function(done) {
    return market.createDApp("dapp1", 200)
    .then(function() {
      return market.startDApp("dapp1");
    })
    .then(function() {
      return market.nodes.call("node1");
    })
    .then(function(node) {
      assert.strictEqual("master", node[1].hexDecode(), "Contract data created incorrectly")
    })
    .then(function() {
      return market.nodes.call("node3");
    })
    .then(function(node) {
      assert.strictEqual("worker",node[1].hexDecode(), "Contract data created incorrectly")
      return done();
    })
  });
});
