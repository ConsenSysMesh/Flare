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
	ConfigDB = new Mongo.Collection("config")
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
							<a className={this.checkPath("/settings")} href="/settings">
								<span className='icon fa fa-cloud-download' aria-hidden='true'></span>
								Settings
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
