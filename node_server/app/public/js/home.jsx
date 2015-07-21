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
						<h5>ID: </h5>
						<div className= 'infotext' id='cassID'>NA</div>
					</span>
					<span>
						<h5>Gossip Active: </h5>
						<div className= 'infotext' id='cassGossipActive'>NA</div>
					</span>
					<span>
						<h5>Thrift Active: </h5>
						<div className= 'infotext' id='cassThriftActive'>NA</div>
					</span>
					<span>
						<h5>Uptime: </h5>
						<div className= 'infotext' id='cassUptime'>NA</div>
					</span>
					<span>
						<h5>Heap Memory (MB): </h5>
						<div className= 'infotext' id='cassHeapMemory'>NA</div>
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
				ws.send('{"flag": "homepage", "name": "frontend", "text": "cass"}');
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
						//TODO: this is hardcoded for 0 at the moment...need to fix spacing
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
				document.getElementById('ipfs-public-key').innerHTML = data.text.publicKey;
			}
			if(data.success == true && data.flag == 'cass'){
				document.getElementById('cassID').innerHTML = data.text.cassID;
				document.getElementById('cassGossipActive').innerHTML = data.text.cassGossipActive;
				document.getElementById('cassThriftActive').innerHTML = data.text.cassThriftActive;
				document.getElementById('cassUptime').innerHTML = data.text.cassUptime;
				document.getElementById('cassHeapMemory').innerHTML = data.text.cassHeapMemory;
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
