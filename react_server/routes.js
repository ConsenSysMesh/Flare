var JSX = require('node-jsx').install();
var React = require('react');
var Homepage = React.createElement(require('./views/home.jsx'));

module.exports = function(app){
    //Homepage
	app.get('/', function(req, res){
	 	res.send(React.renderToString(Homepage))
	});
}
