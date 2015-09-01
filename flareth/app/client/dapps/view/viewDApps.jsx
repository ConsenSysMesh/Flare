Meteor.startup(function() {
  Router.route('/dapps/view', function () {
    this.render('viewDApps')
  })

  Template.viewDApps.rendered = function() {
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
        var contract = Meteor.globals.contract
        if (Meteor.globals.useBlockapps) {
          var URL = Meteor.globals.URL

          contract.blockapps.object.sync(URL,function() {
            /*apps.forEach(function(app) {
            console.log("App:");console.log(app.toString());
            })*/
          })
        } else {
          var self = this;
          contract.web3.object.dappList(this.props.index, function(err, name) {
            contract.web3.object.dapps.call(name,function(err,info) {
              self.setState({
                master: web3.toAscii(info[0]),
                ident: web3.toAscii(info[1]),
                fee: info[2].toNumber(),
                on: info[3]
              })
            })
          })
        }
      },
      render: function() {
        var classes = classNames({
          dapp: true,
          clearLeft: this.props.clearLeft
        })

        return (
          <label className={classes}>
            <input type="radio" name="dapp" value={this.state.ident} readOnly></input>
            <h3 className="ident">{this.state.ident}</h3>
            <h3 className="master">{this.state.master}</h3>
            <h3 className="fee">{this.state.fee}</h3>
            <h3 className="on">{this.state.on.toString()}</h3>
          </label>
        )
      },
      componentDidMount: function() {
        $('.dapp input[type=radio]').click(function() {
          $('.dapp').removeClass('active');
          $('#actions').addClass('active');
          $(this).parent().addClass('active');
        });
      }
    })

    /*Grid of all DApps in the market contract*/
    var DApps = React.createClass({
      render: function() {
        var div = React.createElement('div',{id: "display"},[])
        for(var i=0; i< this.props.numDApps; i++) {
          if(i%3 == 0)
          div.props.children.push(<DApp clearLeft={true} index={i}/>)
          else
          div.props.children.push(<DApp clearLeft={false} index={i}/>)
        }

        return (div)
      }
    })

    var DAppActions = React.createClass({
      getInitialState: function() {
        return {
          value: 0
        }
      },
      startup: function() {
        var contract = Meteor.globals.contract
        if(Meteor.globals.useBlockapps) {}
        else {
          var name = $("input[name=dapp]:checked").val()
          contract.web3.object.startDApp(name, {
            from: Meteor.globals.coinbase,
            gas: 100,
            gasPrice:1
          }, function() {
          })
        }
      },
      render: function() {
        return (
          <div id="actions">
            <h3>Details and Actions</h3>
            <div>
              <button id="startup" onClick={this.startup}>Start DApp</button>
            </div>
          </div>
        )
      }
    })

    function renderPage(numDApps) {
      React.render(
        <div id="viewDApps">
          <DApps numDApps={numDApps}/>
          <DAppActions/>
        </div>, $('#mainContent')[0]
      )
    }
    renderPage(0)

    var contract = Meteor.globals.contract
    if (Meteor.globals.useBlockapps) {
      contract.blockapps.object.get(contract.blockapps.URL,function(numDApps) {
        renderPage(numDApps)
      }, "numDApps")
    } else {
      contract.web3.object.numDApps(function(err, numDApps) {
        renderPage(numDApps)
      })
    }
  }

})
