var express = require('express');
var http = require('http');
var path = require('path');
var sassMiddleware = require('node-sass-middleware');
var errorhandler = require('errorhandler');

var app =  express();

app.set('port', process.env.PORT || 35273);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(
    sassMiddleware({
        src: __dirname + '/public/sass',
        dest: __dirname + '/public/css',
        prefix:  '/css',
        debug: true,
    })
 );


app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(errorhandler());
}

require('./routes')(app)

var localServer = http.createServer(app).listen(app.get('port'), function(){
  console.log('Flare server listening on port ' + app.get('port'));
});

var masterServer = http.createServer(app).listen(38477, function(){
  console.log('Spark Master server listening on port ' + 38477);
});

require('./websocket/websockets')(localServer, masterServer)
