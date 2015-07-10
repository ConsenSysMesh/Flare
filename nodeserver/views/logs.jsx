var JSX = require('node-jsx').install();
var React = require('react');
var global = require('./global.jsx');

var Logs = React.createClass({
	displayName: "Logs",
    render: function(){
    	return(
			<div className='row'>
      			<div className='container logs'>
      			  <h3>Logs</h3>
      			</div>
    		</div>
		)
    }
})
module.exports = Logs 
