Meteor.startup( function(){
  Router.route('/settings', function () {
    this.render('settings');
  })
  Meteor.subscribe('config');

  Template.settings.rendered = function() {
    //TODO: auto update the config in the background, rendering this call superfluous
    Meteor.call('getConfig')

    var Flare = React.createClass({
      getInitialState: function() {
        return {
          directory: "",
          address: "",
          price: "",
          local : {
            ip: "",
            port: ""
          },
          master : {
            ip: "",
            port: ""
          }
        }
      },
      render: function(){
        return(
          <div>
            <h1>Flare</h1>
            <form>
              <label>Directory
                <input type='text' placeholder={this.state.directory} disabled/>
              </label>
              <label>Ethereum Address
                <input type='text' placeholder={this.state.address} disabled/>
              </label>
              <label>Price
                <input type='text' placeholder={this.state.price} disabled/>
              </label>
              <h2>Local Node</h2>
              <label>IP Address
                <input type='text' placeholder={this.state.local.ip} disabled/>
              </label>
              <label>Port
                <input type='text' placeholder={this.state.local.port} disabled/>
              </label>
              <h2>Master Node</h2>
              <label>IP Address
                <input type='text' placeholder={this.state.master.ip} disabled/>
              </label>
              <label>Port
                <input type='text' placeholder={this.state.master.port} disabled/>
              </label>
            </form>
          </div>
        )
      }
    })

    var Spark = React.createClass({
      getInitialState: function() {
        return {
          directory: "",
          master: {
            ip: "",
            port: ""
          },
          receiverMemory: "",
          cores: "",
          log4j: {
            rootCategory: "",
            appender: "",
            directory: "",
            maxFileSize: "",
            layout: "",
            ConversionPattern: ""
          }
        }
      },
      componentDidMount: function() {
        var self = this
        Tracker.autorun(function() {
          ConfigDB.find({}, {fields: {spark: 1}}).observeChanges({
            added: function(id, fields) {
              this.changed(id, fields)
            },
            changed: function(id, fields) {
               self.setState(fields['spark'])
            }
          })
        })
      },
      render: function(){
        return(
          <div>
            <h1>Spark</h1>
            <form>
              <label>Directory
                <input type='text' placeholder={this.state.directory} disabled/>
              </label>
              <h2>Master Settings</h2>
              <label>IP
                <input type='text' placeholder={this.state.master.ip} disabled/>
              </label>
              <label>Port
                <input type='text' placeholder={this.state.master.port} disabled/>
              </label>
              <label>Memory allowed
                <input type='text' placeholder={this.state.receiverMemory} disabled/>
              </label>
              <label>Cores Allowed
                <input type='text' placeholder={this.state.cores} disabled/>
              </label>
              <h2>Logging Settings</h2>
              <h3>Changing disabled options may break Flare</h3>
              <label>Root Category
                <input type='text' placeholder={this.state.log4j.rootCategory} disabled/>
              </label>
              <label>Appender
                <input type='text' placeholder={this.state.log4j.appender} disabled/>
              </label>
              <label>Directory
                <input type='text' placeholder={this.state.log4j.directory} disabled/>
              </label>
              <label>Max File Size
                <input type='text' placeholder={this.state.log4j.maxFileSize} disabled/>
              </label>
              <label>Layout
                <input type='text' placeholder={this.state.log4j.layout} disabled/>
              </label>
              <label>Conversion Pattern
                <input type='text' placeholder={this.state.log4j.conversionPattern} disabled/>
              </label>
            </form>
          </div>
        )
      }
    })

    var Cassandra = React.createClass({
      getInitialState: function() {
        return {
          directory: "",
          username: "",
          password: "",
          ip: "",
          port: ""
        }
      },
      componentDidMount: function() {
        var self = this
        Tracker.autorun(function() {
          ConfigDB.find({}, {fields: {cassandra: 1}}).observeChanges({
            added: function(id, fields) {
              this.changed(id, fields)
            },
            changed: function(id, fields) {
               self.setState(fields['cassandra'])
            }
          })
        })
      },
      render: function(){
        return(
          <div>
            <h1>Cassandra</h1>
            <form>
              <label>Directory
                <input type='text' placeholder={this.state.directory} disabled/>
              </label>
              <label>Username
                <input type='text' placeholder={this.state.username} disabled/>
              </label>
              <label>Password
                <input type='text' placeholder={this.state.password} disabled/>
              </label>
              <label>IP Address
                <input type='text' placeholder={this.state.ip} disabled/>
              </label>
              <label>Port
                <input type='text' placeholder={this.state.port} disabled/>
              </label>
            </form>
          </div>
        )
      }
    })

    var Settings = React.createClass({
      render: function(){
        return(
          <div id="settings-page" className="page">
            <Navbar/>
            <Sidebar path={window.location.pathname}/>
            <div className='container'>
              <Flare />
              <Spark />
              <Cassandra />
            </div>
          </div>
        )
      }
    })

    React.render(<Settings />, document.body)
  }
})
