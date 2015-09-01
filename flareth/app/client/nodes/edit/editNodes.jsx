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
        if(Meteor.globals.useBlockapps) {
          contract.blockapps.object.call(contract.blockapps.URL, function(){
            console.log("inside data");
          },
          {
            funcName:"createNode",
            fromAccount:contract.blockapps.userAccount,
            value:0,
            gasPrice:1,
            gasLimit: 3141592
          }, {
            name: name,
            state: state,
            ipaddress: ipaddress
          })
        } else {
          contract.web3.object.createNode(name, state, ipaddress, {
            from: Meteor.globals.coinbase,
            gas: 100,
            gasPrice:1
          }, function() {
          })
        }
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
          {id: "editNodes"},
          [name, state, ipaddress, create]
        )
        return (div)
      }
    })

    React.render(<NewNode/>, $('#mainContent')[0])
  }
})
