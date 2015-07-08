var JSX = require('node-jsx').install();
var React = require('react');

var Home = React.createFactory(
  React.createClass({
    render: function() {
      return (
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
      );
    }
  })
)

module.exports = React.renderToString(Home())
