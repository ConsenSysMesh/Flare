var JSX = require('node-jsx').install();
var React = require('react');
var global = require('./global.jsx');

var Submit = React.createClass({
	displayName: "Submit",
    render: function(){
    	return(
			<div className='row'>
      			<div className='container submit'>
      			  <h3>Submit</h3>
      			</div>
    		</div>
		)
    }
})
module.exports = Submit 
