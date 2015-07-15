ws = new WebSocket('ws://127.0.0.1:38477');

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
				<div>Select DDAPP</div>
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

		var sparkMAdd = 'spark.master ' + form1.value + '|';
		var cassAdd = 'spark.cassandra.connection.host ' + form2.value + '|';
		var cassUname = 'spark.cassandra.auth.username ' + form3.value + '|';
		var cassPass = 'spark.cassandra.auth.password ' + form4.value + '|';
		ws.send('config' + '|' + sparkMAdd + cassAdd + cassUname + cassPass);

		ws.onmessage = function(evt){
			if (evt.data == 'config transferred'){
				document.getElementById('addJar').disabled = false;
				console.log(document.getElementById('addJar'));
				prgbar = document.getElementById('progress-text');
				prgbar.innerHTML = 'Select your Jar';
			}
		};

		event.preventDefault();

	},
	render: function(){
		return(
			<div>
				<button className='btn btn-second add-config' onClick={this.onClick}>
					<div>Submit Config</div>
				</button>
			</div>
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
		ws.send(file.name);
		ws.send(file);
		ws.onmessage = function(evt){
			if (evt.data == 'jar transferred'){
				prgbar = document.getElementById('progress-text');
				prgbar.innerHTML = 'Waiting for confirmation from the network...';
			}
		};
	},
	render: function(){
		return(
			<div className='outline'>
				<Navbar/>
				<Sidebar path={window.location.pathname}/>
				<div className='row'>
					<div className='container submit'>
						<input type='file' id='file-select' style={{display: 'none'}} onChange={this.handleFile}/>
						<h3>Submit</h3>
						<div id= 'textfield'>
						</div>
						<div className= 'config-form'>
							<form>
								<div className= 'form-row'>
									<label id = 'form-label'>Spark Master IP Address
										<input type='text' id = 'spark-master-address' placeholder='Spark Master IP Address'/>
									</label>
								</div>
								<div className= 'form-row'>
									<label id = 'form-label'>Cassandra IP Address
										<input type='text' id = 'cassandra-address' placeholder='Cassandra IP Address'/>
									</label>
								</div>
								<div className= 'form-row'>
									<label id = 'form-label'>Cassandra Username
										<input type='text' id = 'cassandra-username' placeholder='Cassandra Username'/>
									</label>
								</div>
								<div className= 'form-row'>
									<label id = 'form-label'>Cassandra Password
										<input type='password' id = 'cassandra-password' placeholder='Cassandra Password'/>
									</label>
								</div>
							</form>
						</div>
						<div id='button-row'>
							<span><AddConfig/></span>
							<span><AddJar/></span>
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
