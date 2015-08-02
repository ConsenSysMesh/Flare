Meteor.startup( function(){
  Router.route('/logs', function () {
    this.render('logs');
  });

  Template.logs.rendered = function() {
    var logSelect = (
      <div id="log-select" class="row text-center">
        <label htmlFor="sparkUI">
          <input id="sparkUI" name="logtype" type="radio" value="sparkUI"/>
          <span>Spark UI</span>
        </label>
        <label htmlFor="spark">
          <input id="spark" name="logtype" type="radio" value="spark"/>
          <span>Spark</span>
        </label>
        <label htmlFor="tracing">
          <input id="tracing" name="logtype" type="radio" value="tracing"/>
          <span>Tracing</span>
        </label>
        <label htmlFor="session">
          <input id="session" name="logtype" type="radio" value="session"/>
          <span>Session</span>
        </label>
      </div>
    );

    var LogData = React.createClass({
      getInitialState: function() {
        console.log("hey");
        return {
          sparkUI: "spadaad",
          spark: "yooo",
          tracing: "wehoao",
          session: "tricks"
        }
      },
      componentDidMount: function() {
        var self = this
        Meteor.subscribe("spark", function() {
          Tracker.autorun(function () {
            var spark = SparkDB.findOne()
            if(spark) {
              self.setState({
                sparkUI: spark.sparkUILog,
                spark: spark.sparkLog
              })
            }
          })
        })
        Meteor.subscribe("cassandra", function() {
          Tracker.autorun(function () {
            var cassandra = CassandraDB.findOne()
            if(cassandra) {
              self.setState({
                tracing: cassandra.tracing,
                session: cassandra.session
              })
            }
          })
        })
      },
      render: function(){
        return (
          <div id="logData">
            <div id="sparkUI">
              {this.state.sparkUI}
            </div>
            <div id="spark">
              {this.state.spark}
            </div>
            <div id="tracing">
              {this.state.tracing}
            </div>
            <div id="session">
              {this.state.session}
            </div>
          </div>
        )
      }
    })

    var Logs = React.createClass({
      render: function(){
        return(
          <div id="logs-page" className="page">
            <Navbar/>
            <Sidebar path={window.location.pathname}/>
            <h1>Logs</h1>
            {logSelect}
            <LogData/>
          </div>
        )
      }
    })

    React.render(<Logs />, document.body)

    $('#log-select input[type=radio]').click(function() {
      $('#log-select label').toggleClass('checked', false);
      $(this).parent().toggleClass('checked', this.checked);

      $('#logData div').hide()
      $("#logData #"+$("input[name=logtype]:checked").val()).show()

      var type = $("input[name=logtype]:checked").val()
      Meteor.call('getLog',type)
    });
  }

})
