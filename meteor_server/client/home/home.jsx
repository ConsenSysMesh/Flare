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
          <div className='infobox'>
            <div>
              <h5>Local Status: </h5>
              <span>{this.state.status}</span>
            </div>
            <div>
              <h5>Connected Workers: </h5>
              <span>{this.state.workers}</span>
            </div>
            <div>
              <h5>Public Address: </h5>
              <span>{this.state.url}</span>
            </div>
            <div>
              <h5>Running Applications: </h5>
              <span>{this.state.applications}</span>
            </div>
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
          <div className='infobox'>
            <div>
              <h5>Peer ID: </h5>
              <span>{this.state.ID}</span>
            </div>
            <div>
              <h5>Gossip Active: </h5>
              <span>{this.state.gossipActive}</span>
            </div>
            <div>
              <h5>Thrift Active: </h5>
              <span>{this.state.thriftActive}</span>
            </div>
            <div>
              <h5>Uptime: </h5>
              <span>{this.state.uptime}</span>
            </div>
            <div>
              <h5>Heap Memory (MB): </h5>
              <span>{this.state.heapMemory}</span>
            </div>
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
          <div className='infobox'>
            <div>
              <h5>PeerID: </h5>
              <span>{this.state.ID}</span>
            </div>
            <div>
              <h5>Status: </h5>
              <span>{this.state.status}</span>
            </div>
            <div>
              <h5>Swarm Address: </h5>
              <span>{this.state.address}</span>
            </div>
            <div>
              <h5>Public Key: </h5>
              <span>{this.state.publicKey}</span>
            </div>
          </div>
        </div>
      )
    }
  });

  var Home = React.createClass({
    render: function(){
      return (
        <div id="home-page" className="page">
          <Navbar/>
          <Sidebar path={window.location.pathname}/>
          <div className='container'>
            <h1>Welcome to Project: FLARE</h1>
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
