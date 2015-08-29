Meteor.startup(function() {
  var accounts = new Accounts({minPassphraseLength: 6})
  //TODO: have user set their own password
  var accountObject = accounts.new('password rising quantum boba feature swing longing raccoon')

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
          "name": "name"
        }
      ],
      "constant": false,
      "name": "DDAppFinished",
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
      "name": "apps",
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
          "name": "nodename"
        },
        {
          "type": "bytes32",
          "name": "appname"
        }
      ],
      "constant": false,
      "name": "startApp",
      "outputs": [],
      "type": "function"
    },
    {
      "inputs": [
        {
          "type": "bytes32",
          "name": "appname"
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
      "inputs": [],
      "constant": true,
      "name": "numApps",
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
      "inputs": [
        {
          "type": "uint256",
          "name": ""
        }
      ],
      "constant": true,
      "name": "appList",
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
          "name": "ident"
        },
        {
          "type": "uint32",
          "name": "fee"
        }
      ],
      "constant": false,
      "name": "createApp",
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
          "name": "appIdent"
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
    }
  ]
  Meteor.globals.contract.web3.factory = web3.eth.contract(abi)
  //Meteor.globals.contract = web3.eth.contract(abi).at('0x006396931197dbfc64356ae03cfc7b7ee9af1bbf') //BlockApps address
  //Meteor.globals.contract = web3.eth.contract(abi).at('0xbd353ef1204c2b455f8538cc45288b0be1eb28c3') //TestRPC address

  var Header = React.createClass({
    getInitialState: function() {
      return {
        value: Meteor.globals.contract.address
      }
    },
    setContract: function(event) {
      this.newState({
        value: event.target.value
      })
      var contractFactory = Meteor.globals.contract.web3.factory
      Meteor.globals.contract.web3.object = contractFactory.at(event.target.value)
    },
    componentDidMount: function() {
      var contractFactory = Meteor.globals.contract.web3.factory
      Meteor.globals.contract.web3.object = contractFactory.at(this.state.value)
    },
    render: function() {
      return (
        <label htmlFor="marketAddress">
          <span>Market Address</span>
          <input id="marketAddress" value={this.state.value} onChange={this.setContract}/>
        </label>
      );
    }
  })

  React.render(<Header/>, $('#headerContent')[0])
})
