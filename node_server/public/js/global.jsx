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
											<span className='icon fa fa-dot-circle-o' aria-hidden='true'></span> Home
											</a>
										</li>

										<li>
											<a className={this.checkPath("/connections")} id="connections" href="/connections">
												<span className='icon fa fa-globe' aria-hidden='true'></span> Connections
												</a>
											</li>

											<li>
												<a className={this.checkPath("/submit")} id= "submit" href="/submit">
													<span className='icon fa fa-cloud-upload' aria-hidden='true'></span> Submit
													</a>
												</li>

												<li>
													<a className={this.checkPath("/settings")} id="settings" href="/settings">
														<span className='icon fa fa-cog' aria-hidden='true'></span> Settings
														</a>
													</li>

													<li>
														<a className={this.checkPath("/logs")} id="logs" href="/logs">
															<span href="/logs" className='icon fa fa-list' aria-hidden='true'></span> Logs
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
							return(
								<div className='bs-navbar'>
									<nav className='navbar navbar-inverse navbar-fixed-top'>
										<div className='container-fluid'>
											<div className='row'>
												<div className='col-sm-2 branding'>
													<div className='row'>
														<div className='navbar-header'>
															<a className='navbar-brand col-xs-12' href='/'>
																<span className='icon fa fa-fire logo' aria-hidden='true'/><span>flare</span>
															</a>
														</div>
													</div>
												</div>
												<div className='col-sm-10'>
													<ul className='nav navbar-nav navbar-right collapse navbar-collapse'>
														<li>
															<a href='https://github.com/lumichael94/flare' id='github' className='fa fa-github' target='_blank' title='Github Repository'>
															</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</nav>
								</div>
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
