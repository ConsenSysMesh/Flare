var JSX = require('node-jsx').install();
var React = require('react');
var global = require('./global.jsx');

var Connections = React.createClass({
	displayName: "Connections",
    render: function(){
    	return(
			<div className='outline'>
			<div className='row'>
      			<div className='container connections'>
      			  <h3>Connections</h3>
      			</div>
    		</div>
			</div>
		)
    }
})
module.exports = Connections 
