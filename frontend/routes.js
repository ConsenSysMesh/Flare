var JSX = require('node-jsx').install();
var React = require('react');

module.exports = function(app){
    //Homepage

app.get('/', function(req, res){
  res.send(require('./views/home.jsx'))
});

}
