/*Exports
SparkDB
CassandraDB
IPFSDB
JARSDB
EthereumDB
Navbar
Sidebar
*/
Meteor.startup( function(){
	SparkDB = new Mongo.Collection("spark")
	CassandraDB = new Mongo.Collection("cassandra")
	IPFSDB = new Mongo.Collection("ipfs")
	JARSDB = new Mongo.Collection("jars")
	EthereumDB = new Mongo.Collection("ethereum")
	Meteor.subscribe("ethereum", function() {
		EthereumDB.find().observeChanges({
			added: function(id, fields) {
				var helpers = ethlightjs.helpers
				var api = new ethlightjs.blockchainapi.blockappsapi("http://stablenet.blockapps.net")

				var password = "silly horse battery staple nonce trying bass uke ethersys"
				var seed = "print angle evolve stick wild blue hidden danger nest bar retire north"
				var keystore = keystore = new ethlightjs.keystore(seed, password)
				var address = keystore.generateNewAddress(password)
				var value = 50*fields.operations; //lightwallet sends in units of eth

				api.getNonce(address, function(error,nonce){
					txObj = {gasLimit: 30000, nonce: nonce}
					helpers.sendValueTx(address, fields.address, value, txObj, api, keystore, password, function(error, result){
						console.log("sent transaction")
						console.log(error)
						console.log(result);
					})
				})
				EthereumDB.remove(id)
			}
		})
	})

	EthereumDB.insert({address:"05e1e2b994e9965e12e26446143c79e72230d2a3", operations:2})


	Sidebar = React.createClass({
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
				<div className='sidebar'>
					<ul className='nav'>
						<li className='active'>
							<a className={this.checkPath("/")} href="/">
								<span className='icon fa fa-dot-circle-o' aria-hidden='true'></span>
								Home
							</a>
						</li>

						<li>
							<a className={this.checkPath("/connections")}href="/connections">
								<span className='icon fa fa-globe' aria-hidden='true'></span>
								Connections
							</a>
						</li>

						<li>
							<a className={this.checkPath("/submit")} href="/submit">
								<span className='icon fa fa-cloud-upload' aria-hidden='true'></span>
								Submit
							</a>
						</li>

						<li>
							<a className={this.checkPath("/receive")} href="/receive">
								<span className='icon fa fa-cloud-download' aria-hidden='true'></span>
								Receive
							</a>
						</li>

						<li>
							<a className={this.checkPath("/logs")} href="/logs">
								<span href="/logs" className='icon fa fa-list' aria-hidden='true'></span>
								Logs
							</a>
						</li>

					</ul>
				</div>
			)
		}
	})

	Navbar = React.createClass({
		render: function(){
			//Hardcoded Balance, need lightwallet integration
			return(
				<nav className='navbar'>
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


	IncludeTemplate = React.createClass({
		componentDidMount: function() {
			var componentRoot = React.findDOMNode(this);
			var parentNode = componentRoot.parentNode;
			parentNode.removeChild(componentRoot);
			return Blaze.render(this.props.template, parentNode);
		},
		render: function(template) {
			return (<div />)
		}
	})
})
