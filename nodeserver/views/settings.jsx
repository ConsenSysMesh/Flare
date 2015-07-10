var JSX = require('node-jsx').install();
var React = require('react');
var global = require('./global.jsx');

var Settings = React.createClass({
	displayName: "Settings",
    render: function(){
    	return(
			<div className='row'>
      			<div className='container settings'>
      			  <h3>Settings</h3>
      			</div>
    		</div>
		)
    }
})
module.exports = Settings 
