Meteor.startup( function(){
  Router.route('/submit', function () {
    this.render('submit');
  });

  //TODO: Customize file upload settings using params from
  //https://github.com/tomitrescak/meteor-uploads

  Template.uploadForm.created = function() {
    Uploader.init(this);
    Uploader.finished = function(index, fileInfo, templateContext) {
      fileInfo.state = "new"
      console.log(fileInfo);
      JARSDB.insert(fileInfo);
    }
  }

  Template.uploadForm.rendered = function () {
    Uploader.render.call(this);
    Meteor.subscribe("jars", function() {
      Tracker.autorun(function () {
        JARSDB.find().observeChanges({
          changed: function(id, fields) {
            $("#uploadForm #progressBar").addClass("complete")
          }
        })
      })
    })
  }

  Template.uploadForm.events({
    'click #upload': function (e) {
      Uploader.startUpload.call(Template.instance(), e);
    },
    'click #selectFile': function (e) {
      e.preventDefault()
      console.log($("#uploadForm #selectFileHandler"));
      $("#uploadForm #selectFileHandler").trigger("click")
    }
  })

  Template.uploadForm.helpers({
    info: function() {
      var instance = Template.instance();

      // we may have not yet selected a file
      var info = instance.info.get()
      if (!info) {
        return;
      }

      var progress = instance.globalInfo.get();

      // we display different result when running or not
      return progress.running ?
        info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
        info.name + ' - ' + info.size + 'B';
    },
    progress: function() {
      return Template.instance().globalInfo.get().progress + '%';
    }
  })

  Template.submit.rendered = function() {
  var AddJar= React.createClass({
  	onClick: function(event){
  		console.log('Uploading File');
  		//event.preventDefault();
  	},
  	render: function(){
  		return(
        <div></div>
  		)
  	}
  });

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
  				<button className='btn btn-second' onClick={this.onClick}>
  					Submit Config
  				</button>
  		)
  	}
  });

  var Submit = React.createClass({
  	render: function(){
  		return(
  			<div>
  				<Navbar/>
  				<Sidebar path={window.location.pathname}/>
  				<div className='row'>
  					<div id="submit-page" className='container'>
  						<h1 id='submit'>Submit</h1>
  						<div id='textfield'>
  						</div>
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
