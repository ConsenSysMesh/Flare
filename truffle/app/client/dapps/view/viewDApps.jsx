Meteor.startup(function() {
  Router.route('/dapps/view', function () {
    this.render('viewDApps')
  })

  Template.viewDApps.rendered = function() {
    var contract = Meteor.globals.contract

    /*A single Dapp with state taken from the contract*/
    var DApp = React.createClass({
      getInitialState: function() {
        return {
          ident: "loading...",
          master: "",
          fee: 0,
          on: false
        }
      },
      componentWillMount: function() {
        var self = this;
        contract.appList(this.props.index, function(err, name) {
          contract.apps.call(name,function(err,info) {
            self.setState({
              master: web3.toAscii(info[0]),
              ident: web3.toAscii(info[1]),
              fee: info[2],
              on: info[3]
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
            <h3 className="ident">{this.state.ident}</h3>
            <h3 className="master">{this.state.master}</h3>
            <h3 className="fee">{this.state.fee}</h3>
            <h3 className="on">{this.state.on}</h3>
          </div>
        )
      }
    })

    /*Grid of all DApps in the market contract*/
    var DApps = React.createClass({
      render: function() {
        var div = React.createElement('div',{id: "dappsInner"},[])
        for(var i=0; i< this.props.numDApps; i++) {
          if(i%3 == 0)
          div.props.children.push(<DApp clearLeft={true} index={i}/>)
          else
          div.props.children.push(<DApp clearLeft={false} index={i}/>)
        }

        return (div)
      }
    })
    contract.numApps(function(err, numDApps) {
      React.render(<DApps numDApps={numDApps}/>, $('#dappsOuter')[0])
    })
  }

})
