Meteor.startup(function() {
  Router.route('/', function () {
    this.render('viewNodes')
  })
  Router.route('/nodes/view', function () {
    this.render('viewNodes')
  })

  Template.viewNodes.rendered = function() {
    var contract = Meteor.globals.contract

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
        var self = this;
        contract.nodeList(this.props.index, function(err, name) {
          contract.nodes.call(name,function(err,info) {
            self.setState({
              state: web3.toAscii(info[0]),
              ipaddress: web3.toAscii(info[1]),
              appIdent: web3.toAscii(info[2]),
              coinbase: info[3],
              name: web3.toAscii(info[4])
            })
          })
        })
      },
      render: function() {
        var classes = classnames({
          dapp: true,
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
        var div = React.createElement('div',{id: "nodesInner"},[])
        for(var i=0; i< this.props.numNodes; i++) {
          if(i%3 == 0)
          div.props.children.push(<Node clearLeft={true} index={i}/>)
          else
          div.props.children.push(<Node clearLeft={false} index={i}/>)
        }

        return (div)
      }
    })
    contract.numNodes(function(err, numNodes) {
      React.render(<Nodes numNodes={numNodes}/>, $('#nodesOuter')[0])
    })
  }

})
