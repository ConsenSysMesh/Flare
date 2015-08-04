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
  it("should get node state and ip", function(done) {
    return market.createNode("node1", "online", "127.0.0.1")
    .then(function() {
      return market.getState.call("node1");
    })
    .then(function(state) {
      var hexstate = "online".hexEncode()
      assert.strictEqual(hexstate, state.substring(2,14), "Contract data created incorrectly")
    })
    .then(function() {
      return market.getIPAddress.call("node1");
    })
    .then(function(ip) {
      hexip = "127.0.0.1".hexEncode()
      assert.strictEqual(hexip, ip.substring(2,20), "Contract data created incorrectly")
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
      console.log(data);
      assert.strictEqual(data.c[0], 5, "Contract data created incorrectly")
      return done();
    })
  })

  it("should get apps fee", function(done) {
    return market.createApp("marke1", 200)
    .then(function() {
      return market.getFee.call("marke1");
    })
    .then(function(data) {
      var fee = 200
      assert.strictEqual(fee, data.c[0], "Contract data created incorrectly")
      return done();
    })
  });
  it("should set a master node", function(done) {
    return market.createNode("marketer1", "online", "127.0.0.1")
    .then(function () {
      return market.createApp("marke1", 200)
    })
    .then(function() {
      return market.getMasterName.call("marke1");
    })
    .then(function(data) {
      var hexstate = "marketer1".hexEncode()
      assert.strictEqual(hexstate, data.substring(2,20), "Contract data created incorrectly")
      return done();
    })
  });
  it("should let master start apps", function(done) {
    return market.createNode("marketer1", "online", "127.0.0.1")
    .then(function () {
      return market.createApp("app1", 200)
    })
    .then(function() {
      return market.startApp("marketer1","app1");
    })
    .then(function() {
      return market.getOn.call("app1");
    })
    .then(function(data) {
      assert.isTrue(data, "Contract data created incorrectly")
      return done();
    })
  });
  return it("should make other nodes become workers", function(done) {
    return market.createApp("app1", 200)
    .then(function() {
      return market.startApp("node1","app1");
    })
    .then(function() {
      return market.getState.call("node1");
    })
    .then(function(state) {
      assert.strictEqual("master", state.hexDecode(), "Contract data created incorrectly")
    })
    .then(function() {
      return market.getState.call("node3");
    })
    .then(function(data) {
      assert.strictEqual("worker",data.hexDecode(), "Contract data created incorrectly")
      return done();
    })
  });
});
