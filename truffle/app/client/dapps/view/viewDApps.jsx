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
        if (Meteor.globals.useBlockapps) {
          var contract = Meteor.globals.contract
          var URL = Meteor.globals.URL

          contract.blockapps.object.sync(URL,function() {
            console.log(contract.get["appsList"])
            /*apps.forEach(function(app) {
            console.log("App:");console.log(app.toString());
            })*/
          })
        } else {
          var self = this;
          contract.web3.object.appList(this.props.index, function(err, name) {
            contract.web3.object.apps.call(name,function(err,info) {
              self.setState({
                master: web3.toAscii(info[0]),
                ident: web3.toAscii(info[1]),
                fee: info[2],
                on: info[3]
              })
            })
          })
        }
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
        console.log(this.props.numDApps);
        var div = React.createElement('div',{id: "viewDApps"},[])
        for(var i=0; i< this.props.numDApps; i++) {
          if(i%3 == 0)
          div.props.children.push(<DApp clearLeft={true} index={i}/>)
          else
          div.props.children.push(<DApp clearLeft={false} index={i}/>)
        }

        return (div)
      }
    })
    if (Meteor.globals.useBlockapps) {
      contract.blockapps.object.get(Meteor.globals.contract.blockapps.URL,function(numDApps) {
        console.log("hello");
        React.render(<DApps numDApps={numDApps}/>, $('#mainContent')[0])
      },"numDApps")
    } else {
    contract.web3.object.numApps(function(err, numDApps) {
      React.render(<DApps numDApps={numDApps}/>, $('#mainContent')[0])
    })
    }
  }

})
