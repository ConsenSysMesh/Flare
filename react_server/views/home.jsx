var JSX = require('node-jsx').install();
var React = require('react');

var Home = React.createClass({
	displayName: "Home",
    render: function() {
    	return(
			<link rel="stylesheet" type="text/css" href="/static/global.css"/>
			<h3>Node Info</h3>	
		)
    }
})
module.exports = Home
