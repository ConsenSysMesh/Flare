Meteor.startup( function(){
  Router.route('/', function () {
    this.render('home');
  })

Template.home.rendered = function() {
  var Spark = React.createClass({
    getInitialState: function() {
      return {
        status: "INACTIVE",
        workers: "N/A",
        url: "N/A",
        applications: "N/A"
      }
    },
    componentDidMount: function() {
      var self = this
    Meteor.subscribe("spark", function() {
        Tracker.autorun(function () {
          var info = SparkDB.findOne()
          if(info && info["Status"])
            self.setState({
              status: info["Status"],
              workers: info["Workers"],
              url: info["URL"],
              applications: info["Applications"]
            })
        })
      })
    },
    render: function(){
      return(
        <div>
          <h3>Spark</h3>
          <div id = 'infobox'>
            <span>
              <h5>Local Status: </h5>
              <div className= 'infotext'>{this.state.status}</div>
            </span>
            <span>
              <h5>Connected Workers: </h5>
              <div className= 'infotext' id='sparkConnected'>{this.state.workers}</div>
            </span>
            <span>
              <h5>Public Address: </h5>
              <div className= 'infotext' id='sparkPublicAddress'>{this.state.url}</div>
            </span>
            <span>
              <h5>Running Applications: </h5>
              <div className= 'infotext' id='sparkRunningApplications'>{this.state.applications}</div>
            </span>
          </div>
        </div>
      )
    }
  });
  var Cassandra = React.createClass({
    getInitialState: function() {
      return {
        ID: "N/A",
        gossipActive: "No",
        thriftActive: "No",
        uptime: "N/A",
        heapMemory: "N/A"
      }
    },
    componentDidMount: function() {
      var self = this
    Meteor.subscribe("cassandra", function() {
        Tracker.autorun(function () {
          var info = CassandraDB.findOne()
          console.log(JSON.stringify(info) + "inof");
          if(info)
          self.setState({
            ID: info["ID"],
            gossipActive: info["gossipActive"],
            thriftActive: info["thriftActive"],
            uptime: info["uptime"],
            heapMemory: info["heapMemory"]
          })
        })
      })
    },
    render: function(){
      return(
        <div>
          <h3>Cassandra</h3>
          <div id = 'infobox'>
            <span>
              <h5>Peer ID: </h5>
              <div className= 'infotext'>{this.state.ID}</div>
            </span>
            <span>
              <h5>Gossip Active: </h5>
              <div className= 'infotext'>{this.state.gossipActive}</div>
            </span>
            <span>
              <h5>Thrift Active: </h5>
              <div className= 'infotext'>{this.state.thriftActive}</div>
            </span>
            <span>
              <h5>Uptime: </h5>
              <div className= 'infotext'>{this.state.uptime}</div>
            </span>
            <span>
              <h5>Heap Memory (MB): </h5>
              <div className= 'infotext'>{this.state.heapMemory}</div>
            </span>
          </div>
        </div>
      )
    }
  });
  var IPFS = React.createClass({
    getInitialState: function() {
      return {
        ID: "N/A",
        status: "Not connected",
        address: "N/A",
        publicKey: "N/A"
      }
    },
    componentDidMount: function() {
      var self = this
    Meteor.subscribe("ipfs", function() {
        Tracker.autorun(function () {
          var info = IPFSDB.findOne()
          if(info)
          self.setState({
            ID: info["ID"],
            status: info["status"],
            address: info["address"],
            publicKey: info["publicKey"]
          })
        })
      })
    },
    render: function(){
      return(
        <div>
          <h3>IPFS</h3>
          <div id = 'infobox'>
            <span>
              <h5>PeerID: </h5>
              <div className= 'infotext'>{this.state.ID}</div>
            </span>
            <span>
              <h5>Status: </h5>
              <div className= 'infotext'>{this.state.status}</div>
            </span>
            <span>
              <h5>Swarm Address: </h5>
              <div className= 'infotext'>{this.state.address}</div>
            </span>
            <span id='publickey'>
              <h5>Public Key: </h5>
              <div className= 'infotext'>{this.state.publicKey}</div>
            </span>
          </div>
        </div>
      )
    }
  });

  var Home = React.createClass({
    displayName: "Home",
    render: function(){
      return (
        <div id="home-page">
          <Navbar/>
          <Sidebar path={window.location.pathnam}/>
          <div className='container home'>
            <h2>Welcome to Project: FLARE</h2>
            <Spark/>
            <Cassandra/>
            <IPFS/>
          </div>
        </div>
      )
    }
  });


  React.render(<Home />, document.body)
}

})
