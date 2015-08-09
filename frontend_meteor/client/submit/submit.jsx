Meteor.startup( function(){
  Router.route('/submit', function () {
    this.render('submit');
  });


  Template.submit.rendered = function() {
    var AddConfig= React.createClass({
      onClick: function(event){
        console.log('Uploading Config');

        //Grab text from form fields.
        //Find form fields
        var form1= $('#spark-master-address');
        var form2= $('#cassandra-address');
        var form3= $('#cassandra-username');
        var form4= $('#cassandra-password');

        var response = "";
        prgbar = $('#progress-text');
        prgbar.innerHTML = 'Waiting for confirmation from the network...';

        response = {
          sparkMasterAddress: form1.val(),
          cassAddress: form2.val(),
          cassUsername: form3.val(),
          cassPassword: form4.val()
        }

        event.preventDefault();

      },
      render: function(){
        return(
          <button onClick={this.onClick}>
            Submit Config
          </button>
        )
      }
    });

    var Submit = React.createClass({
      render: function(){
        return(
          <div id="submit-page" className="page">
            <Navbar/>
            <Sidebar path={window.location.pathname}/>
            <div className='container'>
              <h1>Submit</h1>
              <form>
                <label>Spark Master IP Address
                  <input type='text' id='spark-master-address' placeholder='Spark Master IP Address' disabled/>
                </label>
                <label>Cassandra IP Address
                  <input type='text' id='cassandra-address' placeholder='Cassandra IP Address' disabled/>
                </label>
                <label>Cassandra Username
                  <input type='text' id='cassandra-username' placeholder='Cassandra Username' disabled/>
                </label>
                <label>Cassandra Password
                  <input type='password' id='cassandra-password' placeholder='Cassandra Password'disabled/>
                </label>
              </form>
              <div id='button-row'>
                <AddConfig/>
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
