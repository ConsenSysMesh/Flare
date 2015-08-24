Meteor.startup(function() {
  Router.route('/node', function () {
    this.render('node')
  })

  Template.node.rendered = function() {
    var NewDApp = React.createClass({
      createNewNode: function(argument) {
        Meteor.globals.contract.call(Meteor.globals.apiURL, function(){
          console.log("inside data");
        },
        {
          funcName:"createNode",
          fromAccount:Meteor.globals.userAccount,
          value:0,
          gasPrice:1,
          gasLimit: 3141592
        }, {
          name: "testNode",
          state:"offline",
          ipaddress:"127.0.0.1"
        })
      },
      render: function() {
        var ident = (
          <label>
            <span>Identifier</span>
            <input id="ident"/>
          </label>
        )
        var fee = (
          <label>
            <span>Price</span>
            <input id="price"/>
          </label>
        )

        var create = (
          <button id="create" onClick={this.createNewNode}>Create</button>
        )
        var div = React.createElement(
          'div',
          {id: "newDapp"},
          [ident, fee, create]
        )
        return (div)
      }
    })

    React.render(<NewDApp />, $('#nodePage')[0])
  }
})
