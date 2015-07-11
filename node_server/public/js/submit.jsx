var Addfile = React.createClass({
	handleClick: function(){
		console.log('Upload File has been clicked');
	},
	render: function(){
		return(
		<button className='btn btn-second add-file' onClick={this.handleClick.bind(null)}>Select DDAPP Jar</button>
	  	)
	}
});

var Submit = React.createClass({
	displayName: "Submit",
    render: function(){
    	return(
			<div className='outline'>
				<div className='row'>
      				<div className='container submit'>
      				  <h3>Submit</h3>
					  <Addfile/>
      				</div>
    			</div>
			</div>
		)
    }
})
