Meteor.startup(function() {
  Router.route('/nodes/edit', function () {
    this.render('editNodes')
  })

  Template.editNodes.rendered = function() {
    var NewNode = React.createClass({
      createNewNode: function(argument) {
        var contract = Meteor.globals.contract
        var name = $("#name").val()
        var state = $("#state").val()
        var ipaddress = $("#ipaddress").val()
        contract.createNode(name, state, ipaddress, {
          from:"0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
          gas: 100,
          gasPrice:1
        }, function() {
        })
      },
      render: function() {
        var name = (
          <label>
            <span>Name</span>
            <input id="name"/>
          </label>
        )
        var state = (
          <label>
            <span>State</span>
            <input id="state"/>
          </label>
        )
        var ipaddress = (
          <label>
            <span>IP Address</span>
            <input id="ipaddress"/>
          </label>
        )

        var create = (
          <button id="create" onClick={this.createNewNode}>Create</button>
        )
        var div = React.createElement(
          'div',
          {id: "newNode"},
          [name, state, ipaddress, create]
        )
        return (div)
      }
    })

    React.render(<NewNode/>, $('#editNodes')[0])
  }
})
