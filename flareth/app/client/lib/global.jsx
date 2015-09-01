Meteor.globals = {
  coinbase: "82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
  contract: {
    address: "a8809efd13fce61d2f81a32dc8e410ca8e50b791",
    blockapps: {
      object: null,
      URL: "http://hacknet.blockapps.net",
      userAccount: null
    },
    web3: {
      factory: null,
      object: null
    }
  },
  useBlockapps: false
}

Meteor.startup(function() {
  /**Configuring the blockapps contract object**/
  var Contract = require("Contract")
  var Solidity = require("Solidity")

  Meteor.globals.contract.blockapps.userAccount = Contract({"privkey":"1dd885a423f4e212740f116afa66d40aafdbb3a381079150371801871d9ea281"})

  var contractCode = Solidity(`
    contract Market {

      struct Node {
        bytes32 state; //online, master, worker, offline
        bytes32 ipaddress;
        bytes32 dappIdent;
        address coinbase;
        bytes32 name;
      }

      mapping (bytes32 => Node) public nodes;
      bytes32[2**5] public nodeList;
      uint32 public numNodes;

      //Parameters should be fields in the struct, then add it to the nodeList
      function createNode(bytes32 name, bytes32 state, bytes32 ipaddress) {
        nodes[name] = Node({name: name, state: state, ipaddress: ipaddress, dappIdent:"", coinbase:msg.sender});
        nodeList[numNodes] = name;
        numNodes += 1;
      }

      function getState(bytes32 name) returns (bytes32) {
        return nodes[name].state;
      }

      function getIPAddress(bytes32 name) returns (bytes32){
        return nodes[name].ipaddress;
      }

      //TODO if there is time
      /*
      function removeNode() {
        // Remove node from list?
        // Remember to call penalizeNode if their state says that they are in the middle of an
        // application.
      }

      function penalizeNode(){
        //Penalize node if state of application isn't finished
        //Parameters: Something like address/hash, and then the amount penalized?
      }

      function setState(bytes32 name, bytes32 state) {
        nodes[name].state = state;
      }
      //we probably don't need that
      function setIPAddress(bytes32 name, bytes32 ipaddress) {
        nodes[name].ipaddress = ipaddress;
      }*/

      struct DApp {
        bytes32 master;
        bytes32 ident;
        uint32 fee;
        bool on;
      }

      //Vars
      mapping (bytes32 => DApp) public dapps;
      bytes32[2**5] public dappList;
      uint32 public numDApps;

      //	Parameter should be the driver nodes, amount of ethereum in escrow, escrow address
      //	(in the future, add the size of ddapp, memory needed, etc) to determine the
      //	most efficient processing.
      function createDApp(bytes32 ident, uint32 fee) {
        Node masterNode;
        uint i;
        for(i =0; i < numNodes; i++) {
          masterNode = nodes[nodeList[i]];
          if (masterNode.state == "online") {
            masterNode.state = "master";
            masterNode.dappIdent = ident;
            break;
          }
        }
        dapps[ident]= DApp({master: masterNode.name, ident: ident, fee: fee, on: false});
        dappList[numDApps] = ident;
        numDApps += 1;

        for(i =0; i < numNodes && i < 5; i++) { //TODO: Get a better way of limiting nodes
          Node worker = nodes[nodeList[i]];
          if (worker.state == "online") {
            worker.state = "worker";
            worker.dappIdent = ident;
          }
        }
        //DDAP is not started a this point
      }

      function startDApp(bytes32 dappname) {
        if(nodes[dapps[dappname].master].coinbase == msg.sender)
        dapps[dappname].on = true;
      }

      function payNode(bytes32 dappname, bytes32 nodename){
        nodes[nodename].coinbase.send(dapps[dappname].fee);
      }

      //TODO: write test case
      function finishDApp(bytes32 name) {
        for(var i =0; i < nodeList.length; i++) {
          nodes[nodeList[i]].state = "online";
          nodes[nodeList[i]].dappIdent = "";
        }
      }
    }`
  )

  contractCode.compile(Meteor.globals.contract.blockapps.URL, function() {
    Meteor.globals.contract.blockapps.object = Contract({address: Meteor.globals.contract.address, symtab: contractCode.symtab})
  })

  /**Configuring the web3 contract object**/

  //var accounts = new Accounts({minPassphraseLength: 6})
  //TODO: have user set their own password
  //var accountObject = accounts.new('password rising quantum boba feature swing longing raccoon')

  //TESTRPC
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  var abi = [
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "name"
        }
      ],
      "constant": false,
      "name": "getState",
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "name"
        }
      ],
      "constant": false,
      "name": "finishDApp",
      "outputs": [],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "name"
        },
        {
          "type": "bytes32",
          "name": "state"
        },
        {
          "type": "bytes32",
          "name": "ipaddress"
        }
      ],
      "constant": false,
      "name": "createNode",
      "outputs": [],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "constant": true,
      "name": "nodeList",
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "dappname"
        },
        {
          "type": "bytes32",
          "name": "nodename"
        }
      ],
      "constant": false,
      "name": "payNode",
      "outputs": [],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "name"
        }
      ],
      "constant": false,
      "name": "getIPAddress",
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "constant": true,
      "name": "dappList",
      "outputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ],
      "type": "function"
    },
    {
      "inputs": [],
      "constant": true,
      "name": "numNodes",
      "outputs": [
        {
          "type": "uint32",
          "name": ""
        }
      ],
      "type": "function"
    },
    {
      "inputs": [],
      "constant": true,
      "name": "numDApps",
      "outputs": [
        {
          "type": "uint32",
          "name": ""
        }
      ],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "dappname"
        }
      ],
      "constant": false,
      "name": "startDApp",
      "outputs": [],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ],
      "constant": true,
      "name": "dapps",
      "outputs": [
        {
          "type": "bytes32",
          "name": "master"
        },
        {
          "type": "bytes32",
          "name": "ident"
        },
        {
          "type": "uint32",
          "name": "fee"
        },
        {
          "type": "bool",
          "name": "on"
        }
      ],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": ""
        }
      ],
      "constant": true,
      "name": "nodes",
      "outputs": [
        {
          "type": "bytes32",
          "name": "state"
        },
        {
          "type": "bytes32",
          "name": "ipaddress"
        },
        {
          "type": "bytes32",
          "name": "dappIdent"
        },
        {
          "type": "address",
          "name": "coinbase"
        },
        {
          "type": "bytes32",
          "name": "name"
        }
      ],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "ident"
        },
        {
          "type": "uint32",
          "name": "fee"
        }
      ],
      "constant": false,
      "name": "createDApp",
      "outputs": [],
      "type": "function"
    }
  ]
  Meteor.globals.contract.web3.factory = web3.eth.contract(abi)

  var Header = React.createClass({
    getInitialState: function() {
      return {
        contract: Meteor.globals.contract.address,
        coinbase: Meteor.globals.coinbase
      }
    },
    setContract: function(event) {
      this.newState({
        contract: event.target.value
      })
      var contractFactory = Meteor.globals.contract.web3.factory
      Meteor.globals.contract.web3.object = contractFactory.at(event.target.value)
    },
    setContract: function(event) {
      this.newState({
        coinbase: event.target.value
      })
      Meteor.globals.coinbase = event.target.value
    },
    componentDidMount: function() {
      var contractFactory = Meteor.globals.contract.web3.factory
      Meteor.globals.contract.web3.object = contractFactory.at(this.state.contract)
      Meteor.globals.coinbase = this.state.coinbase
    },
    render: function() {
      return (
        <div>
          <label htmlFor="contract">
            <span>Contract Address</span>
            <input id="contract" value={this.state.contract} onChange={this.setContract}/>
          </label>
          <label htmlFor="coinbase">
            <span>Coinbase Address</span>
            <input id="coinbase" value={this.state.coinbase} onChange={this.setCoinbase}/>
          </label>
        </div>
      );
    }
  })

  React.render(<Header/>, $('#headerContent')[0])
})
