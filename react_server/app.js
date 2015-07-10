var express = require('express');
var http = require('http');
var path = require('path');
var errorhandler = require('errorhandler');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,  'public')));

if ('development' == app.get('env')) {
  app.use(errorhandler());
}

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
