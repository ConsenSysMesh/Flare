Meteor.startup( function(){
  Router.route('/settings', function () {
    this.render('settings');
  })
  Meteor.subscribe('config')

  Template.settings.rendered = function() {
    var initialConfig = ConfigDB.findOne()

    var Flare = React.createClass({
      getInitialState: function() {
        return initialConfig['flare']
      },
      componentDidMount: function() {
        var self = this
        Tracker.autorun(function() {
          ConfigDB.find({}, {fields: {flare: 1}}).observeChanges({
            added: function(id, fields) {
              this.changed(id, fields)
            },
            changed: function(id, fields) {
              self.setState(fields['flare'])
            }
          })
        })
      },
      handleChange: function(event) {
        var newState = this.state
        if(event.target.value == "")
        newState[event.target.name] = event.target.placeholder
        else
        newState[event.target.name] = event.target.value
        this.setState(newState)
        Meteor.call('setConfig', {$set: {flare: newState}})
      },
      render: function(){
        var state = this.getInitialState()
        return(
          <div>
            <h2>Flare</h2>
            <form>
              <div className="halfColumn">
                <label>Directory
                  <input type='text' name='directory' placeholder={state.directory} onChange={this.handleChange}/>
                </label>
                <label>Ethereum Address
                  <input type='text' name='address' placeholder={state.address} onChange={this.handleChange}/>
                </label>
              </div>
              <div className="halfColumn">
                <label>Price
                  <input type='text' name='price' placeholder={state.price} onChange={this.handleChange}/>
                </label>
              </div>
              <div className="halfColumn">
                <h3>Local Node</h3>
                <label>IP Address
                  <input type='text' name='local.ip' placeholder={state.local.ip} onChange={this.handleChange}/>
                </label>
                <label>Port
                  <input type='text' name='local.port' placeholder={state.local.port} onChange={this.handleChange}/>
                </label>
              </div>
              <div className="halfColumn">
                <h3>Master Node</h3>
                <label>IP Address
                  <input type='text' name='master.ip' placeholder={state.master.ip} onChange={this.handleChange}/>
                </label>
                <label>Port
                  <input type='text' name='master.port' placeholder={state.master.port} onChange={this.handleChange}/>
                </label>
              </div>
            </form>
          </div>
        )
      }
    })

    var Spark = React.createClass({
      getInitialState: function() {
        return initialConfig['spark']
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
      handleChange: function(event) {
        var newState = this.state
        if(event.target.value == "")
        newState[event.target.name] = event.target.placeholder
        else
        newState[event.target.name] = event.target.value
        this.setState(newState)
        Meteor.call('setConfig', {$set: {spark: newState}})
      },
      render: function(){
        var state = this.getInitialState()
        return(
          <div>
            <h2>Spark</h2>
            <form>
            <div className="halfColumn">
              <label>Directory
                <input type='text' name='directory' placeholder={state.directory} onChange={this.handleChange}/>
              </label>
            </div>
              <div  className="fullColumn">
                <h3>Master Settings</h3>
                <div className="halfColumn">
                  <label>IP
                    <input type='text' name='master.ip' placeholder={state.master.ip} onChange={this.handleChange}/>
                  </label>
                  <label>Port
                    <input type='text' name='master.port' placeholder={state.master.port} onChange={this.handleChange}/>
                  </label>
                </div>
                <div className="halfColumn">
                  <label>Memory allowed
                    <input type='text' name='receiverMemory' placeholder={state.receiverMemory} onChange={this.handleChange}/>
                  </label>
                  <label>Cores Allowed
                    <input type='text' name='cores' placeholder={state.cores} onChange={this.handleChange}/>
                  </label>
                </div>
              </div>
              <div className="fullColumn">
                <h3>Logging Settings</h3>
                <h4>Changing the disabled options may break Flare</h4>
                <div className="halfColumn">
                  <label>Root Category
                    <input type='text' name='log4j.rootCategory' placeholder={state.log4j.rootCategory} disabled/>
                  </label>
                  <label>Appender
                    <input type='text' name='log4j.appender' placeholder={state.log4j.appender} disabled/>
                  </label>
                  <label>Directory
                    <input type='text' name='log4j.directory' placeholder={state.log4j.directory} onChange={this.handleChange}/>
                  </label>
                </div>
                <div className="halfColumn">
                  <label>Max File Size
                    <input type='text' name='log4j.maxFileSize' placeholder={state.log4j.maxFileSize} onChange={this.handleChange}/>
                  </label>
                  <label>Layout
                    <input type='text' name='log4j.layout' placeholder={state.log4j.layout} disabled/>
                  </label>
                  <label>Conversion Pattern
                    <input type='text' name='log4j.conversionPattern' placeholder={state.log4j.conversionPattern} disabled/>
                  </label>
                </div>
              </div>
            </form>
          </div>
        )
      }
    })

    var Cassandra = React.createClass({
      getInitialState: function() {
        return initialConfig['cassandra']
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
      handleChange: function(event) {
        var newState = this.state
        if(event.target.value == "")
        newState[event.target.name] = event.target.placeholder
        else
        newState[event.target.name] = event.target.value
        this.setState(newState)
        Meteor.call('setConfig', {$set: {cassandra: newState}})
      },
      render: function(){
        var state = this.getInitialState()
        return(
          <div>
            <h2>Cassandra</h2>
            <form>
              <div className="halfColumn">
                <label>Directory
                  <input type='text' name='directory' placeholder={state.directory} onChange={this.handleChange}/>
                </label>
                <label>Username
                  <input type='text' name='username' placeholder={state.username} onChange={this.handleChange}/>
                </label>
                <label>Password
                  <input type='text' name='password' placeholder={state.password} onChange={this.handleChange}/>
                </label>
              </div>
              <div className="halfColumn">
                <label>IP Address
                  <input type='text' name='address' placeholder={state.ip} onChange={this.handleChange}/>
                </label>
                <label>Port
                  <input type='text' name='port' placeholder={state.port} onChange={this.handleChange}/>
                </label>
              </div>
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
              <h1>Settings</h1>
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
