ws = new WebSocket('ws://127.0.0.1:38477');

var StartReceiver = React.createClass({
	onClick: function(event){
		console.log('Uploading Config');
		ws.send('{"flag": "identify", "name":"receiver"}');
		prgbar = document.getElementById('progress-text');
		prgbar.innerHTML = 'Waiting for confirmation from the network...';

		var form1= document.getElementById('receiver-spark-memory');
		var form2= document.getElementById('receiver-spark-cores');
		var form3= document.getElementById('receiver-public-address');
		var form4= document.getElementById('receiver-price');
		
		var response = "";
		prgbar = document.getElementById('progress-text');
		prgbar.innerHTML = 'Waiting for confirmation from the network...';

		response += '{ "memory": "' + form1.value + '", "cores": "' + form2.value + '", "address": "' + form3.value + '", "price": "' + form4.value + '"}';
		console.log(response);

		ws.send('{"flag": "receiver", "name": "frontend", "text": '+response+'}');


		event.preventDefault();

	},
	render: function(){
		return(
			<button id = 'receiver' className='btn btn-second add-file' onClick={this.onClick}>
				<div>Start Receiver</div>
			</button>
		)
	}
});
var Receive = React.createClass({
	displayName: "Receive",
	//http://spark.apache.org/docs/latest/spark-standalone.html
	
	componentDidMount: function(){			
		ws.onmessage = function(evt){
			var data = JSON.parse(evt.data);
			console.log(data);
			if (data.flag == 'receiver' && data.success){
				prgbartext = document.getElementById('progress-text');
				prgbartext.innerHTML = 'Registered!';
				prgbar = document.getElementById('progress-bar');
				prgbar.id = 'progress-bar-success';
			}
		};
	},
	render: function(){
		return(
			<div className='outline'>
				<Navbar/>
				<Sidebar path={window.location.pathname}/>
				<div className='row'>
					<div className='container Receive'>
						<h3 id = 'receiveh3'>Receive</h3>
						<div id= 'textfield'>
						</div>
						<div className= 'config-form'>
							<form>
								<div className= 'form-row'>
									<label id = 'form-label'>Memory Allowed (MB)
										<input type='text' id = 'receiver-spark-memory' placeholder='Memory allowed on local machine'/>
									</label>
								</div>
								<div className= 'form-row'>
									<label id = 'form-label'>Number of Cores allowed
										<input type='text' id = 'receiver-spark-cores' placeholder='Number of cores available'/>
									</label>
								</div>
								<div className= 'form-row'>
									<label id = 'form-label'>Public IP Address
										<input type='text' id = 'receiver-public-address' placeholder='Public IP address'/>
									</label>
								</div>
								<div className= 'form-row'>
									<label id = 'form-label'>Price
										<input type='text' id = 'receiver-price' placeholder='Cost to run DDApp on your machine'/>
									</label>
								</div>
							</form>
						</div>
						<div id='button-row'>
							<span><StartReceiver/></span>
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
})


React.render(<Receive />, document.body)
