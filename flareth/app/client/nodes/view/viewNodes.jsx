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
          <label className={classes}>
            <input type="radio" name="node" value={this.state.name} readOnly></input>
            <h3 className="name">{this.state.name}</h3>
            <h3 className="state">{this.state.state}</h3>
            <h3 className="ipaddress">{this.state.ipaddress}</h3>
            <h3 className="appIdent">{this.state.appIdent}</h3>
            <h3 className="coinbase">{this.state.coinbase}</h3>
          </label>
        )
      },
      componentDidMount: function() {
        $('.node input[type=radio]').click(function() {
          $('.node').removeClass('active');
          $('#actions').addClass('active');
          $(this).parent().addClass('active');
        });
      }
    })

    /*Grid of all DApps in the market contract*/
    var Nodes = React.createClass({
      render: function() {
        var div = React.createElement('div',{id: "display"},[])
        for(var i=0; i< this.props.numNodes; i++) {
          if(i%3 == 0)
          div.props.children.push(<Node clearLeft={true} index={i}/>)
          else
          div.props.children.push(<Node clearLeft={false} index={i}/>)
        }

        return (div)
      }
    })

    var NodeActions = React.createClass({
      getInitialState: function() {
        return {
          value: 0
        }
      },
      setValue: function(event) {
        this.setState({
          value: event.target.value
        })
      },
      payup: function() {
        if(Meteor.globals.useBlockapps) {}
        else {
          var name = $("input[name=node]:checked").val()
          contract.web3.object.nodes.call(name,function(err,info) {
            contract.web3.object.sendTransaction({
              from: Meteor.globals.coinbase,
              to: info[3],
              value:1
            }, function() {
            })
          })

        }
      },
      render: function() {
        return (
          <div id="actions">
            <h3>Details and Actions</h3>
            <div>
              <label htmlFor="value">
                <span>Amount</span>
                <input id="value" type="number" value={this.state.value} onChange={this.setValue}/>
              </label>
              <button id="payup" onClick={this.payup}>Donate to Node</button>
            </div>
          </div>
        )
      }
    })

    function renderPage(numNodes) {
      React.render(
        <div id="viewNodes">
          <Nodes numNodes={numNodes}/>
          <NodeActions/>
        </div>, $('#mainContent')[0]
      )
    }
    renderPage(0)

    var contract = Meteor.globals.contract
    if (Meteor.globals.useBlockapps) {
      contract.blockapps.object.get(contract.blockapps.URL,function(numNodes) {
        renderPage(numNodes)
      }, "numNodes")
    } else {
      contract.web3.object.numNodes(function(err, numNodes) {
        renderPage(numNodes)
      })
    }
  }
})
