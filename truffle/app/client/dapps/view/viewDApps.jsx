Meteor.startup(function() {
  Router.route('/dapps/view', function () {
    this.render('viewDApps')
  })

  Template.viewDApps.rendered = function() {
    var contract = Meteor.globals.contractFactory.at('0xd71ca02e6c007c3bf7310e84d35c9e4c9b73b45d')

    /*A single Dapp with state taken from the contract*/
    var DApp = React.createClass({
      render: function() {
        var classes = classnames({
          dapp: true,
          clearLeft: this.props.clearLeft
        })

        var info = contract.nodes(this.props.name)
        var state = web3.toAscii(info[0])
        var ipaddress = web3.toAscii(info[1])
        var appIdent = web3.toAscii(info[2])
        var coinbase = info[3]
        var name = web3.toAscii(info[4])

        return (
          <div className={classes}>
          <h3 className="name">{name}</h3>
            <h3 className="state">{state}</h3>
            <h3 className="ipaddress">{ipaddress}</h3>
            <h3 className="appIdent">{appIdent}</h3>
            <h3 className="coinbase">{coinbase}</h3>
          </div>
        )
      }
    })

    /*Grid of all DApps in the market contract*/
    var DApps = React.createClass({
      render: function() {
        var numDapps = 5

        var div = React.createElement('div',{id: "dappsInner"},[])
        for(var i=0; i< contract.numNodes().toNumber(); i++) {
          if(i%3 == 0)
          div.props.children.push(<DApp clearLeft={true} name={contract.nodeList(i)}/>)
          else
          div.props.children.push(<DApp clearLeft={false} name={contract.nodeList(i)}/>)
        }

        return (div)
      }
    })

    React.render(<DApps />, $('#dappsOuter')[0])
  }

})
