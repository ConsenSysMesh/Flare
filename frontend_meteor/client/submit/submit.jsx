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
              <div id='uploadJar'>
                <h2>Upload Jar</h2>
                <IncludeTemplate template={Template.uploadForm} />
              </div>
            </div>
          </div>
        )
      }
    });

    React.render(<Submit />, document.body)
  }
})
