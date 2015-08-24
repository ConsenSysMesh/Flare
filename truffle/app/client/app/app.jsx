Meteor.startup(function() {
  Router.route('/app', function () {
    this.render('app')
  })

  Template.app.rendered = function() {

    var NewDApp = React.createClass({
      createNewDApp: function(argument) {
        console.log("he");
        Meteor.globals.contract.call(Meteor.globals.apiURL, function(){
          console.log("inside data");
        },
        {
          funcName:"createApp",
          fromAccount:Meteor.globals.userAccount,
          value:200,
          gasPrice:1,
          gasLimit: 3141592
        }, {name: "test",
          fee:200
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
          <button id="create" onClick={this.createNewDApp}>Create</button>
        )
        var div = React.createElement(
          'div',
          {id: "newDapp"},
          [ident, fee, create]
        )
        return (div)
      }
    })

    React.render(<NewDApp />, $('#appPage')[0])
  }
})
