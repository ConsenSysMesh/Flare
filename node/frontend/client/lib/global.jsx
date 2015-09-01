/*Exports
SparkDB
CassandraDB
IPFSDB
JARSDB
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
				<div id='sidebar'>
					<a className='navbar-brand' href='/'>
						<img src="/images/logo.png" alt="Flare logo" height="50" width="140" />
					</a>
					<ul>
						<li>
							<a className={this.checkPath("/connections")} href="/connections">
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
				<nav id='navbar'>
					<div id='etherBalance'>10,000,000 ETH</div>
					<a href='https://github.com/lumichael94/flare' id='github' className='fa fa-github'>Github Repository</a>
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
