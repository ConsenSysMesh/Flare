var AddJar= React.createClass({
	onClick: function(event){
		console.log('Uploading File');
		event.preventDefault();
		var select = document.getElementById('file-select');
		select.click();
	},
	render: function(){
		return(
			<button id = 'addJar' className='btn btn-second add-file' onClick={this.onClick}>
				Select DDAPP
			</button>
		)
	}
});

var AddConfig= React.createClass({
	onClick: function(event){
		console.log('Uploading Config');

		//Grab text from form fields.
		//Find form fields
		var form1= document.getElementById('spark-master-address');
		var form2= document.getElementById('cassandra-address');
		var form3= document.getElementById('cassandra-username');
		var form4= document.getElementById('cassandra-password');

		var response = "";
		prgbar = document.getElementById('progress-text');
		prgbar.innerHTML = 'Waiting for confirmation from the network...';

		response += '{ "sparkMasterAddress": "' + form1.value + '", "cassAddress": "' + form2.value + '", "cassUsername": "' + form3.value + '", "cassPassword": "' + form4.value + '"}';

		localWS.send('{"flag": "submit", "name": "frontend", "text": '+response+'}');


		event.preventDefault();

	},
	render: function(){
		return(
				<button className='btn btn-second add-config' onClick={this.onClick}>
					Submit Config
				</button>
		)
	}
});

var Submit = React.createClass({
	displayName: "Submit",
	handleFile: function(e){
		var file = e.target.files[0];
		if(!file){
			console.log('not getting that file');
			return;
		}
		console.log('Handling file');
		localWS.send(file);
	},
	componentDidMount: function(){
		console.log("Ad");

	},
	render: function(){
		return(
			<div>
				<Navbar/>
				<Sidebar path={window.location.pathname}/>
				<div className='row'>
					<div id="submit-page" className='container'>
						<input type='file' id='file-select' style={{display: 'none'}} onChange={this.handleFile}/>
						<h3 id = 'submith3'>Submit</h3>
						<div id= 'textfield'>
						</div>
							<form>
								<label id='form-label'>Spark Master IP Address
									<input type='text' id = 'spark-master-address' placeholder='Spark Master IP Address' disabled/>
								</label>
								<label id='form-label'>Cassandra IP Address
									<input type='text' id = 'cassandra-address' placeholder='Cassandra IP Address' disabled/>
								</label>
								<label id='form-label'>Cassandra Username
									<input type='text' id = 'cassandra-username' placeholder='Cassandra Username' disabled/>
								</label>
								<label id = 'form-label'>Cassandra Password
									<input type='password' id = 'cassandra-password' placeholder='Cassandra Password'disabled/>
								</label>
						</form>
						<div id='button-row'>
							<AddConfig/>
							<AddJar/>
						</div>
						<div id= 'progress-bar'>
							<div id = 'progress-text'>
								Waiting
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});


React.render(<Submit />, document.body)

localWS.onmessage = function(evt){
	console.log(evt.data);
	var data = JSON.parse(evt.data);
	console.log(data);
	if (data.flag == 'submit' && data.success == 'config'){
		prgbartext = document.getElementById('progress-text');
		prgbartext.innerHTML = 'Select DDApp Jar';
	}
	if (data.flag == 'submit' && data.success == 'jar'){
		prgbartext = document.getElementById('progress-text');
		prgbartext.innerHTML = 'Waiting for confirmation from the network...';
	}
	if(data.flag == 'submit' && data.success == 'success'){
		prgbartext = document.getElementById('progress-text');
		prgbartext.innerHTML = 'Registered!';
		prgbar = document.getElementById('progress-bar');
		prgbar.id = 'progress-bar-success';
	}
};
