Meteor.startup( function(){
  Router.route('/receive', function () {
    this.render('receive');
  })

Template.receive.rendered = function() {

  var StartReceiver = React.createClass({
  	onClick: function(event){
  		console.log('Uploading Config');
  		localWS.send('{"flag": "identify", "name":"receiver"}');
  		prgbar = $('#progress-text');
  		prgbar.innerHTML = 'Waiting for confirmation from the network...';

  		var form1= $('#receiver-spark-memory');
  		var form2= $('#receiver-spark-cores');
  		var form3= $('#receiver-public-address');
  		var form4= $('#receiver-price');

  		var response = "";
  		prgbar = $('#progress-text');
  		prgbar.innerHTML = 'Waiting for confirmation from the network...';

  		response += '{ "memory": "' + form1.value + '", "cores": "' + form2.value + '", "address": "' + form3.value + '", "price": "' + form4.value + '"}';
  		console.log(response);

  		localWS.send('{"flag": "receiver", "name": "frontend", "text": '+response+'}');

  		event.preventDefault();

  	},
  	render: function(){
  		return(
  			<button id = 'receiver' className='btn btn-second add-file' onClick={this.onClick}>
  				<div>Become Receiver</div>
  			</button>
  		)
  	}
  });
  var Receive = React.createClass({
  	displayName: "Receive",
  	render: function(){
  		return(
  			<div>
  				<Navbar/>
  				<Sidebar path={window.location.pathname}/>
  					<div id="receive-page" className='container'>
  						<h3>Receive</h3>
  						<form>
  							<label id = 'form-label'>Memory Allowed (MB)
  								<input type='text' id = 'receiver-spark-memory' placeholder='Memory allowed on local machine' disabled/>
  							</label>
  							<label id = 'form-label'>Number of Cores allowed
  								<input type='text' id = 'receiver-spark-cores' placeholder='Number of cores available' disabled/>
  							</label>
  							<label id = 'form-label'>Public IP Address
  								<input type='text' id = 'receiver-public-address' placeholder='Public IP address'disabled/>
  							</label>
  							<label id = 'form-label'>Price
  								<input type='text' id = 'receiver-price' placeholder='Cost to run DDApp on your machine' disabled/>
  							</label>
  						</form>
  						<StartReceiver/>
  						<div id= 'progress-bar'>
  							<div id = 'progress-text'>
  								Waiting
  							</div>
  						</div>
  				</div>
  			</div>
  		)
  	}
  })


  React.render(<Receive />, document.body)

  localWS.onmessage = function(evt){
  	var data = JSON.parse(evt.data);
  	console.log(data);
  	if (data.flag == 'receiver' && data.success){
  		prgbartext = $('#progress-text');
  		prgbartext.innerHTML = 'Registered!';
  		prgbar = $('#progress-bar');
  		prgbar.id = 'progress-bar-success';
  	}
  }

}

})
