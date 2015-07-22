module.exports = function(app)
{
  app.get('/', function(req, res) {
  	res.render('./home.html');
  });

  app.get('/connections', function(req, res) {
  	res.render('./connections.html');
  });

  app.get('/submit', function(req, res) {
    res.render('./submit.html');
  });

  app.get('/receive', function(req, res) {
    res.render('./receive.html');
  });

  app.get('/logs', function(req, res) {
    res.render('./logs.html');
  });
}
