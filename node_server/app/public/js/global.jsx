var Sidebar = React.createClass({
	checkPath: function(id){
		if(this.props.path == id){
			return 'link active';
		}
		else{
			return 'link';
		}
	},
	render: function(){
		return(
			<div className='container-fluid'>
				<div className='row'>
					<div className='navbar-collapse collapse in' id='bs4'>
						<div className='col-sm-2 sidebar'>

							<div className='row'>
								<ul id='side' className='nav nav-sidebar'>
									<li className='active'>
										<a className={this.checkPath("/")} id = "home" href="/">
											<span className='icon fa fa-dot-circle-o' aria-hidden='true'></span>
											Home
										</a>
									</li>

									<li>
										<a className={this.checkPath("/connections")} id="connections" href="/connections">
											<span className='icon fa fa-globe' aria-hidden='true'></span>
											Connections
										</a>
									</li>

									<li>
										<a className={this.checkPath("/submit")} id= "submit" href="/submit">
											<span className='icon fa fa-cloud-upload' aria-hidden='true'></span>
											Submit
										</a>
									</li>

									<li>
										<a className={this.checkPath("/receive")} id="receiver" href="/receive">
											<span className='icon fa fa-cloud-download' aria-hidden='true'></span>
											Receive
										</a>
									</li>

									<li>
										<a className={this.checkPath("/logs")} id="logs" href="/logs">
											<span href="/logs" className='icon fa fa-list' aria-hidden='true'></span>
											Logs
										</a>
									</li>

								</ul>
							</div>

						</div>
					</div>
				</div>
			</div>
		)
	}
});

var Navbar = React.createClass({
	render: function(){
		//Hardcoded Balance, need lightwallet integration
		return(
			<nav className='navbar navbar-inverse navbar-fixed-top'>
				<a className='navbar-brand col-xs-12' href='/'>
					<span className='icon fa fa-fire logo' aria-hidden='true'></span>
					<span>flare</span>
				</a>
				<div id = 'etherBalance'>10,000,000 ETH</div>
				<a href='https://github.com/lumichael94/flare' id='github' className='fa fa-github' target='_blank' title='Github Repository'/>
			</nav>
		);
	}
});

	var Template = React.createClass({
		routing: function(){
			var path = window.location.pathname;
			switch(path) {
				case '/':
				return (<Home/>)
				break;
				case '/connections':
				return (<Connections/>)
				break;
				case '/submit':
				return (<Submit/>)
				break;
				case '/settings':
				return (<Settings/>)
				break;
				case '/logs':
				return (<Logs/>)
				break;
			}
		},
		render: function(){
			return(
				<div>
					<Navbar/>
					<Sidebar path={window.location.pathname}/>
					<div className='container'>
						{this.routing()}
					</div>
				</div>
			)
		}
	})

var localWS = new WebSocket('ws://127.0.0.1:35273');
localWS.onopen = function(evt) {
	localWS.send('{"flag": "identify", "name":"frontend"}');
};

var masterWS = new WebSocket('ws://127.0.0.1:38477');
masterWS.onopen = function(evt) {
	masterWS.send('{"flag": "identify", "name":"frontend"}');
};

masterWS.onmessage = function(evt){
	console.log(evt.data);
	var data = $.parseJSON(evt.data)

	if (data.flag == "processPayment") {
		$.getScript("/lib/js/ethlightjs.min.js", function(){
			//TODO this who section should get data from an ethereum contract
			var helpers = ethlightjs.helpers
			var api = new ethlightjs.blockchainapi.blockappsapi("http://stablenet.blockapps.net")

			var password = "silly horse battery staple nonce trying bass uke fuck"
			var seed = "print angle evolve stick wild blue hidden danger nest bar retire north"
			var keystore = keystore = new ethlightjs.keystore(seed, password)
			var address = keystore.generateNewAddress(password)
			var value = 50*data.operations; //lightwallet sends in units of eth

			api.getNonce(address, function(error,nonce){
				txObj = {gasLimit: 30000, nonce: nonce}
				helpers.sendValueTx(address, data.address, value, txObj, api, keystore, password)
			})
		});
	}
};
