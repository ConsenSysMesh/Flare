ws = new WebSocket('ws://127.0.0.1:38477');

var Spark = React.createClass({
	render: function(){
		return(
			<div>
				<h3>Spark</h3>
				<div id = 'infobox'>
					<span>
						<h5>Local Status: </h5>
						<div className= 'infotext' id='sparkLocalStatus'>NA</div>
					</span>
					<span>
						<h5>Connected: </h5>
						<div className= 'infotext' id='sparkConnected'>false</div>
					</span>
					<span>
						<h5>Public Address: </h5>
						<div className= 'infotext' id='sparkPublicAddress'>NA</div>
					</span>
					<span>
						<h5>Running Applications: </h5>
						<div className= 'infotext' id='sparkRunningApplications'>None</div>
					</span>
				</div>
			</div>
		)
	}
});
var Cassandra = React.createClass({
	render: function(){
		return(
			<div>
				<h3>Cassandra</h3>
				<div id = 'infobox'>
					<span>
						<h5>Local Status: </h5>
						<div className= 'infotext' id='cassLocalStatus'>NA</div>
					</span>
					<span>
						<h5>Connected: </h5>
						<div className= 'infotext' id='cassConnected'>false</div>
					</span>
					<span>
						<h5>Public Address: </h5>
						<div className= 'infotext' id='cassPublicAddress'>NA</div>
					</span>
				</div>
			</div>
		)
	}
});
var IPFS = React.createClass({
	render: function(){
		return(
			<div>
				<h3>IPFS</h3>
				<div id = 'infobox'>
					<span>
						<h5>Local Status: </h5>
						<div className= 'infotext' id='IPFSLocalStatus'>NA</div>
					</span>
					<span>
						<h5>Connected: </h5>
						<div className= 'infotext' id='IPFSConnected'>false</div>
					</span>
					<span>
						<h5>Peer ID: </h5>
						<div className= 'infotext' id='IPFSPublicAddress'>NA</div>
					</span>
					<span id='publickey'>
						<h5>Public Key: </h5>
						<div className= 'infotext' id='IPFSRunningApplications'>
							<textArea id='ipfs-public-key'></textArea>
						</div>
					</span>
				</div>
			</div>
		)
	}
});

var Home = React.createClass({
	displayName: "Home",
	componentDidMount: function(){			
		ws.onmessage = function(evt){
			console.log(evt.data);
			var data = JSON.parse(evt.data);
			//initial connection
			if(data.success == true && data.flag == null){
				ws.send('{"flag": "identify", "name":"frontend"}');
				ws.send('{"flag": "homepage", "name": "frontend", "text": "spark"}');
				ws.send('{"flag": "homepage", "name": "frontend", "text": "IPFS"}');
			}
			if(data.success == true && data.flag == 'spark'){
				var identifier = data.text.substr(0, data.text.indexOf(':'));
				var body = data.text.substr(data.text.indexOf(':')+1)
				switch(identifier){
					case 'Status':
						document.getElementById('sparkLocalStatus').innerHTML = body;
						break;
					case 'Workers':
						document.getElementById('sparkConnected').innerHTML = body + " WORKERS";
						break;
					case 'URL':
						document.getElementById('sparkPublicAddress').innerHTML = body;
						break;
					case 'Applications':
						body = body.replace(/0/g, ' 0 ');
						document.getElementById('sparkRunningApplications').innerHTML = body;
						break;
				}
			}
			if(data.success == true && data.flag == 'IPFS'){
				console.log(data);
				document.getElementById('IPFSLocalStatus').innerHTML = data.text.peerID;
				document.getElementById('IPFSConnected').innerHTML = data.text.currentStatus;
				document.getElementById('IPFSPublicAddress').innerHTML = data.text.swarmAddress;
				//TODO: This is hard coded, I can't seem to have shelljs execute "ipfs id" effectively. FIX!
				document.getElementById('ipfs-public-key').innerHTML = "CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDrW6j72baOd3qQjLF6Qf3ttqSd649MUeMSWHrnIXKf6YRF3rSnR77yTRBSRO6izJD3OnjlOl5m8i47s3lpiNSUfyUONikY2qioxmGzvmOisj1sC5t9SpmHM7F4pxiGycfx56Qmsb6RWEKAfQGE+u2DEoRNBVN+vROgwSxsGsh1nXlVO52+i9HkyEl+2BwKMGAXloYCgNFs0O+UHpZXNSjdRFRzQegYbELZoM5EIYPgjaOzdJbI0Qq0TaoaZCttcAFtyL2Sk2SpDnob4QO7cUE2/kJqwsVx0KsQXKJEfRUcBP7GdllBeJbGyvLZCBrL5uSu6pSq8QZ5/UEYBuJVxISbAgMBAAE=";
			}
		}
	},
	render: function(){
		console.log('GET home');
		return (
			<div className='outline'>
				<Navbar/>
				<Sidebar path={window.location.pathnam}/>
				<div className='row'>
					<div className='container home'>
						<h2>Welcome to Project: FLARE</h2>
						<Spark/>
						<Cassandra/>
						<IPFS/>
					</div>
				</div>
			</div>
		)
	}
});


React.render(<Home />, document.body)
