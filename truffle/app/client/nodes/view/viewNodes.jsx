Meteor.startup(function() {
  Router.route('/', function () {
    this.render('viewNodes')
  })
  Router.route('/nodes/view', function () {
    this.render('viewNodes')
  })

  Template.viewNodes.rendered = function() {
    /*A single Dapp with state taken from the contract*/
    var Node = React.createClass({
      getInitialState: function() {
        return {
          name: "loading...",
          state: "",
          ipaddress: "",
          coinbase: "",
          appIdent: ""
        }
      },
      componentWillMount: function() {
        var contract = Meteor.globals.contract
        var self = this;
        if (Meteor.globals.useBlockapps) {
          contract.blockapps.object.sync(contract.blockapps.URL,function() {
            var name = contract.blockapps.object.get["nodeList"][self.props.index].toString()
            var info = contract.blockapps.object.get["nodes"](name)
            console.log(info);
            self.setState({
              state: web3.toAscii(info[0]),
              ipaddress: web3.toAscii(info[1]),
              appIdent: web3.toAscii(info[2]),
              coinbase: info[3],
              name: web3.toAscii(info[4])
            })
          })
        } else {
          contract.web3.object.nodeList(this.props.index, function(err, name) {
            contract.web3.object.nodes.call(name,function(err,info) {
              self.setState({
                state: web3.toAscii(info[0]),
                ipaddress: web3.toAscii(info[1]),
                appIdent: web3.toAscii(info[2]),
                coinbase: info[3],
                name: web3.toAscii(info[4])
              })
            })
          })
        }
      },
      render: function() {
        var classes = classNames({
          node: true,
          clearLeft: this.props.clearLeft
        })

        return (
          <div className={classes}>
            <h3 className="name">{this.state.name}</h3>
            <h3 className="state">{this.state.state}</h3>
            <h3 className="ipaddress">{this.state.ipaddress}</h3>
            <h3 className="appIdent">{this.state.appIdent}</h3>
            <h3 className="coinbase">{this.state.coinbase}</h3>
          </div>
        )
      }
    })

    /*Grid of all DApps in the market contract*/
    var Nodes = React.createClass({
      render: function() {
        var div = React.createElement('div',{id: "viewNodes"},[])
        for(var i=0; i< this.props.numNodes; i++) {
          if(i%3 == 0)
          div.props.children.push(<Node clearLeft={true} index={i}/>)
          else
          div.props.children.push(<Node clearLeft={false} index={i}/>)
        }

        return (div)
      }
    })

    var contract = Meteor.globals.contract
    if (Meteor.globals.useBlockapps) {
      contract.blockapps.object.get(contract.blockapps.URL,function(numNodes) {
        console.log(numNodes);
        React.render(<Nodes numNodes={numNodes}/>, $('#mainContent')[0])
      }, "numNodes")
    } else {
      contract.web3.object.numNodes(function(err, numNodes) {
        React.render(<Nodes numNodes={numNodes}/>, $('#mainContent')[0])
      })
    }
  }
})
