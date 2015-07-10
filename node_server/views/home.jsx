var JSX = require('node-jsx').install();
var React = require('react');

var Home = React.createClass({
	displayName: "Home",
    render: function(){
		console.log('GET home');
    	return(
			<div className='outline'>
			    <div className='row'>
      				<div className='container home'>
      				  <h3>Welcome to Project: FLARE</h3>
      				</div>
    			</div>
			</div>
		)
    }
});
module.exports = Home
