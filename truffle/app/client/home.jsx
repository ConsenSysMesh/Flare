Template.dapps.rendered = function() {

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

  var DApps = React.createClass({
    render: function() {
      var numDapps = 5

      var div = React.createElement('div',[],[])
      div.props.id="dappsInner"
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
