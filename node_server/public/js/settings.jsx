var Settings = React.createClass({
	displayName: "Settings",
	render: function(){
		return(
			<div className='outline'>
				<Navbar/>
				<Sidebar path={window.location.pathname}/>
				<div className='row'>
					<div className='container settings'>
						<h3>Settings</h3>
					</div>
				</div>
			</div>
		)
	}
})


React.render(<Settings />, document.body)
