Meteor.startup( function(){
  Router.route('/submit', function () {
    this.render('submit');
  });


  Template.submit.rendered = function() {
    var Submit = React.createClass({
      render: function(){
        return(
          <div id="submit-page" className="page">
            <Navbar/>
            <Sidebar path={window.location.pathname}/>
            <div className='container'>
              <h1>Submit</h1>
              <div id='button-row'>
                <IncludeTemplate template={Template.uploadForm} />
              </div>
              <div id='progress-bar'>
                <div id='progress-text'>
                  Waiting
                </div>
              </div>
            </div>
          </div>
        )
      }
    });

    React.render(<Submit />, document.body)
  }
})
