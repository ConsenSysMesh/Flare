Meteor.startup(function() {
  Router.route('/dapps/edit', function () {
    this.render('editDApps')
  })

  Template.editDApps.rendered = function() {
    var NewDApp = React.createClass({
      createNewDApp: function(argument) {
        var contract = Meteor.globals.contract
        var ident = $("#ident").val()
        var fee = $("#fee").val()
        contract.createApp(ident, parseInt(fee), {
          from:"0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
          gas: 100,
          gasPrice:1
        }, function() {
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
            <input id="fee"/>
          </label>
        )

        var create = (
          <button id="create" onClick={this.createNewDApp}>Create</button>
        )
        var div = React.createElement(
          'div',
          {id: "newDApp"},
          [ident, fee, create]
        )
        return (div)
      }
    })

    React.render(<NewDApp />, $('#editDApps')[0])
  }
})
