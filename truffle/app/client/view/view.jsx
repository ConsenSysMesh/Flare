Meteor.startup(function() {
  Router.route('/', function () {
    this.render('view')
  })
  Router.route('view', function () {
    this.render('view')
  })

  Template.dapps.rendered = function() {

    /*A single Dapp with state taken from the contract*/
    var DApp = React.createClass({
      getInitialState: function() {
        return {
          ident: "Demo DApp",
          fee: 1000000,
          on: "false"
        }
      },
      render: function() {
        var classes = classnames({
          dapp: true,
          clearLeft: this.props.clearLeft
        })

        return (
          <div className={classes}>
            <h3 className="dappIdent">{this.state.ident}</h3>
            <h4 className="dappFee">{this.state.fee}</h4>
            <h4 className="dappOn">{this.state.on}</h4>
          </div>
        )
      }
    })

    /*Grid of all DApps in the market contract*/
    var DApps = React.createClass({
      render: function() {
        var numDapps = 5

        var div = React.createElement('div',{id: "dappsInner"},[])
        for(var i=0; i< numDapps; i++) {
          if(i%3 == 0)
          div.props.children.push(<DApp clearLeft={true}/>)
          else
          div.props.children.push(<DApp clearLeft={false}/>)
        }

        return (div)
      }
    })

    React.render(<DApps />, $('#dappsOuter')[0])
  }

})
