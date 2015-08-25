Meteor.startup(function() {
  Meteor.globals = {
    privkey: "",
    contractFactory: null,
    contract: null
  }

  // See below for options passed to the constructor.
  /*var provider = new BlockAppsWeb3Provider({
  host: "http://hacknet.blockapps.net"
  })*/

  //TESTRPC
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
  //web3.setProvider(provider);

  Meteor.globals.privkey = "1dd885a423f4e212740f116afa66d40aafdbb3a381079150371801871d9ea281"

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
  Meteor.globals.contractFactory = web3.eth.contract(abi)
  Meteor.globals.contract = web3.eth.contract(abi).at('0xbe9ac4e1155485a2fe2077d3af6a1a89bbd01996')
})
