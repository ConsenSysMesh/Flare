var JSX = require('node-jsx').install();
var React = require('react');
var global = require('./global.jsx');

var body = (
	<body>
		<h3>Hi!!</h3>
  	</body>
)

var Home = React.createClass({
	displayName: "Home",
    render: function(){
    	return(
			<html>
				{global.head}
				<global.nav path="home"/>
				{body}
			</html>
		)
    }
})
module.exports = Home
