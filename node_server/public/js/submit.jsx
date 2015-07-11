ws = new WebSocket('ws://127.0.0.1');

var Addfile = React.createClass({
	onClick: function(event){
		console.log('Uploading File');
		event.preventDefault();
		var select = document.getElementById('file-select');
		select.click();
	},
	render: function(){
		return(
		<button className='btn btn-second add-file' onClick={this.onClick}>
			<div>Select DDAPP</div>
		</button>
	  	)
	}
});

var Submit = React.createClass({
	displayName: "Submit",
	handleFile: function(e){
		var file = e.target.files[0];
		if(!file){
			console.log('not getting that file');
			return;
		}
		console.log('Handling file');
		console.log(file.name);
		ws.send(file);
	},
    render: function(){
    	return(
			<div className='outline'>
				<div className='row'>
      				<div className='container submit'>
						<input type='file' id='file-select' style={{display: 'none'}} onChange={this.handleFile}/>
      				  	<h3>Submit</h3>
					  	<Addfile/>
      				</div>
    			</div>
			</div>
		)
    }
})
