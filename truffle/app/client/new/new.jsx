Meteor.startup(function() {
  Router.route('/new', function () {
    this.render('new')
  })

  Template.new.rendered = function() {

    var NewDApp = React.createClass({
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
          <button id="create">Create</button>
        )
        var div = React.createElement('div',
        {id: "newDapp"},
        [ident, fee, create]
      )
      return (div)
    }
  })

  React.render(<NewDApp />, $('#newPage')[0])
}

})
