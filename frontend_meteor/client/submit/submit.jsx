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

    //self.$ = $
    React.render(<Submit />, document.body)

    /*
    localWS.onmessage = function(evt){
    console.log(evt.data);
    var data = JSON.parse(evt.data);
    console.log(data);
    if (data.flag == 'submit' && data.success == 'config'){
    prgbartext = $('#progress-text');
    prgbartext.innerHTML = 'Select DDApp Jar';
    }
    if (data.flag == 'submit' && data.success == 'jar'){
    prgbartext = $('#progress-text');
    prgbartext.innerHTML = 'Waiting for confirmation from the network...';
    }
    if(data.flag == 'submit' && data.success == 'success'){
    prgbartext = $('#progress-text');
    prgbartext.innerHTML = 'Registered!';
    prgbar = $('#progress-bar');
    prgbar.id = 'progress-bar-success';
    }
    }
    */

  }
})
