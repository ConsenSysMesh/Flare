Meteor.startup( function(){
  Router.route('/connections', function () {
    this.render('connections');
  });

Template.connections.rendered = function() {
  var SparkConnect = React.createClass({
    getInitialState: function() {
      return {
        data: []
      }
    },
    componentDidMount: function() {
      var self = this
    Meteor.subscribe("spark", function() {
        Tracker.autorun(function () {
          var info = SparkDB.findOne()
          if(info && info["connections"])
          self.setState({
            data: info["connections"]
          })
        })
      })
    },
    render: function() {
      var nodeTable = this.state.data.map(function (node) {
        return (
          <tr>
            <td>{node.ID}</td>
            <td>{node.address}</td>
            <td>{node.state}</td>
            <td>{node.cores}</td>
            <td>{node.memory}</td>
          </tr>
        )
      })
      return(
        <div>
          <h3>Spark</h3>
          <div id = 'infobox'>
            <span>
              <h5>Master: </h5>
              <div className= 'infotext' id='sparkMaster'>NA</div>
            </span>
            <span>
              <h5>Workers: </h5>
              <div className='infotext' id='sparkWorkers'>
                <table id='sparkWorkersTable'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Address</th>
                      <th>State</th>
                      <th>Cores</th>
                      <th>Memory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodeTable}
                  </tbody>
                </table>
              </div>
            </span>
          </div>
        </div>
      )
    }
  });
  var CassandraConnect = React.createClass({
    getInitialState: function() {
      return {
        data: []
      }
    },
    componentDidMount: function() {
      var self = this
    Meteor.subscribe("cassandra", function() {
        Tracker.autorun(function () {
          var info = CassandraDB.findOne()
          if(info)
          self.setState({
            data: info["connections"]
          })
        })
      })
    },
    render: function() {
      var nodeTable = this.state.data.map(function (node) {
        return (
          <tr>
            <td>{node.address}</td>
            <td>{node.status}</td>
            <td>{node.state}</td>
            <td>{node.owns}</td>
            <td>{node.token}</td>
          </tr>
        )
      })
      return(
        <div>
          <h3>Cassandra</h3>
          <div id = 'infobox'>
            <span>
              <h5>Top Peers: </h5>
              <div className= 'infotext' id='cassandraTable'>
                <table id='cassandraPeersTable'>
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Status</th>
                      <th>State</th>
                      <th>Owns</th>
                      <th>Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodeTable}
                  </tbody>
                </table>
              </div>
            </span>
          </div>
        </div>
      )
    }
  });
  var IPFSConnect = React.createClass({
    getInitialState: function() {
      return {
        data: []
      }
    },
    componentDidMount: function() {
      var self = this
    Meteor.subscribe("ipfs", function() {
        Tracker.autorun(function () {
          var info = IPFSDB.findOne()
          if(info)
          self.setState({
            data: info["connections"]
          })
        })
      })
    },
    render: function(){
      var nodeTable = this.state.data.map(function (node) {
        return (
          <tr>
            <td>{node.address}</td>
          </tr>
        )
      })
      return(
        <div>
          <h3>IPFS</h3>
          <div id = 'infobox'>
            <h5>Top Peers: </h5>
            <div className= 'infotext' id='IPFSTable'>
              <table id = 'IPFSPeersTable'>
                <thead>
                  <tr><th>Peer ID</th></tr>
                </thead>
                <tbody>
                  {nodeTable}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  });


  var Connections = React.createClass({
    displayName: "Connections",
    render: function(){
      return(
        <div id="connections-page">
          <Navbar/>
          <Sidebar path={window.location.pathname}/>
          <div id="connections-page" className="container">
            <h3>Connections</h3>
            <SparkConnect/>
            <CassandraConnect/>
            <IPFSConnect/>
          </div>
        </div>
      )
    }
  });

  React.render(<Connections />, document.body)

}

})
