var SparkConnect = React.createClass({

	populateApplicationRow: function(){
			return(
				<tr>
					<th>app-2842371219</th>
					<th>FIRE:192.168.1.2.3</th>
					<th>6</th>
					<th>1024.0 MB</th>
					<th>7/14/2015/</th>
					<th>automation</th>
					<th>Running</th>
					<th>1.5h</th>
				</tr>
			)
	},
	runningApplication: function(){
		return(
				<table id = 'sparkApplicationsTable'>
					<tbody>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Cores</th>
							<th>Memory Per Node</th>
							<th>Submitted Time</th>
							<th>User</th>
							<th>State</th>
							<th>Duration</th>
						</tr>
						{this.populateApplicationRow()}
					</tbody>
				</table>
		)
	},
	//https://facebook.github.io/react/docs/thinking-in-react.html
	populateWorkerRow: function(){
		return(
			<tr>
				<th>worker-284719</th>
				<th>192.168.1.2.3</th>
				<th>ALIVE</th>
				<th>4 (2 Used)</th>
				<th>6.3 GB (1024.0 MB used)</th>
			</tr>
		)
	},
	render: function(){
		return(
			<div>
			<h3>Spark</h3>
			<div id = 'infobox'>
				<span>
					<h5>Master: </h5>
					<div className= 'infotext' id='sparkMaster'>NA</div>
				</span>
				<span>
					<h5>Workers: </h5>
					<div className= 'infotext' id='sparkWorkers'>
						<table id = 'sparkWorkersTable'>
							<tbody>
								<tr>
									<th>ID</th>
									<th>Address</th>
									<th>State</th>
									<th>Cores</th>
									<th>Memory</th>
								</tr>
								{this.populateWorkerRow()}
								{this.populateWorkerRow()}
								{this.populateWorkerRow()}
								{this.populateWorkerRow()}
							</tbody>
						</table>
					</div>
				</span>
				<span>
					<h5>Applications: </h5>
					<div className= 'infotext' id= 'sparkApplications'>
						{this.runningApplication()}
					</div>
				</span>
			</div>
			</div>
	  	)
	}
});
var CassandraConnect = React.createClass({
	populateCassNodeRow: function(){
		return(
				<tr>
					<th>172.31.28.240</th>
					<th>Up</th>
					<th>Normal</th>
					<th>100%</th>
					<th>9153377038966602289</th>
				</tr>
		)
	},
	render: function(){
		return(
			<div>
			<h3>Cassandra</h3>
			<div id = 'infobox'>
				<span>
					<h5>Top Peers: </h5>
					<div className= 'infotext' id='cassandraTable'>
						<table id = 'cassandraPeersTable'>
							<tbody>
								<tr>
									<th>Address</th>
									<th>Status</th>
									<th>State</th>
									<th>Owns</th>
									<th>Token</th>
								</tr>
								{this.populateCassNodeRow()}
							</tbody>
						</table>
					</div>
				</span>
			</div>
			</div>
	  	)
	}
});
var IPFSConnect = React.createClass({
	populateIPFSNodeRow: function(){
		return(
				<tr>
					<th>QmNeK3hRF5Pu9dPcMDKXvYofQioskuGfQZEQz43UDkLepK</th>
					<th>178.62.206.163</th>
				</tr>
		)
	},
	render: function(){
		return(
			<div>
			<h3>IPFS</h3>
			<div id = 'infobox'>
				<span>
					<h5>Top Peers: </h5>
					<div className= 'infotext' id='IPFSTable'>
						<table id = 'IPFSPeersTable'>
							<tbody>
								<tr>
									<th>Peer ID</th>
									<th>Address</th>
								</tr>
								{this.populateIPFSNodeRow()}
							</tbody>
						</table>
					</div>
				</span>
			</div>
			</div>
	  	)
	}
});


var Connections = React.createClass({
	displayName: "Connections",
	render: function(){
		return(
			<div className='outline'>
				<div className='row'>
					<div className='container connections'>
						<h3>Connections</h3>
						<SparkConnect/>
						<CassandraConnect/>
						<IPFSConnect/>
					</div>
				</div>
			</div>
		)
	}
});
