var JSX = require('node-jsx').install();
var React = require('react');
var Homepage = React.createElement(require('./views/home.jsx'));
var template = require('./views/global.jsx');

module.exports = function(app){
	app.get("/*", function(req, res){
		console.log("GET request for: " + req.url);
	 	res.send(React.renderToString(React.createElement(template, {path:req.url})))
	});
}
