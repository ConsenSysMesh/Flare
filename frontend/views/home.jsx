var JSX = require('node-jsx').install();
var React = require('react');

var head = (
  <head>
    <title>Flareth!</title>
    <script src="/lib/js/jquery-2.1.4.min.js"></script>
  </head>
)

var nav = (
  <nav className="navbar navbar-static-top" role="navigation">
    <div className="navbar-header">
      <a className="navbar-brand" href="/">FLARE</a>
    </div>

    <div className="collapse navbar-collapse">
      <ul className="nav navbar-nav">
        <li id="nav-housecomm"><a href="/hethClient">Marketplace</a></li>
        <li id="nav-housecomm"><a href="/mining">Dashboard</a></li>
      </ul>
    </div>
  </nav>
)

var chat =  (
  <div>
    <div>
      <input type="text" id="messageinput"></input>
    </div>
    <div>
      <button type="button" onclick="openSocket();" >Open</button>
      <button type="button" onclick="send();" >Send</button>
      <button type="button" onclick="closeSocket();" >Close</button>
    </div>
    <div id="messages"></div>
  </div>
)

var body = (
  <body>
    {nav}
    {chat}
    <script src="/js/home.js"></script>
  </body>
)

var page = React.createClass({
  render: function() {
    return (
      <html>
        {head}
        {body}
      </html>
    )
  }
})
var Page = React.createFactory(page);

module.exports = React.renderToString(Page())
