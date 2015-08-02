Meteor.startup( function(){
  Router.route('/receive', function () {
    this.render('receive');
  })

  Template.receive.rendered = function() {

    var StartReceiver = React.createClass({
      onClick: function(event){
        console.log('Uploading Config');
        localWS.send('{"flag": "identify", "name":"receiver"}');
        prgbar = $('#progress-text');
        prgbar.innerHTML = 'Waiting for confirmation from the network...';

        var form1= $('#receiver-spark-memory');
        var form2= $('#receiver-spark-cores');
        var form3= $('#receiver-public-address');
        var form4= $('#receiver-price');

        var response = "";
        prgbar = $('#progress-text');
        prgbar.innerHTML = 'Waiting for confirmation from the network...';

        event.preventDefault();

      },
      render: function(){
        return(
          <button id='receiver' onClick={this.onClick}>
            <div>Become Receiver</div>
          </button>
        )
      }
    })
    var Receive = React.createClass({
      render: function(){
        return(
          <div id="receive-page" className="page">
            <Navbar/>
            <Sidebar path={window.location.pathname}/>
            <div className='container'>
              <h1>Receive</h1>
              <form>
                <label>Memory Allowed (MB)
                  <input type='text' id='receiver-spark-memory' placeholder='Memory allowed on local machine' disabled/>
                </label>
                <label>Number of Cores allowed
                  <input type='text' id='receiver-spark-cores' placeholder='Number of cores available' disabled/>
                </label>
                <label>Public IP Address
                  <input type='text' id='receiver-public-address' placeholder='Public IP address'disabled/>
                </label>
                <label>Price
                  <input type='text' id='receiver-price' placeholder='Cost to run DDApp on your machine' disabled/>
                </label>
              </form>
              <StartReceiver/>
            </div>
          </div>
        )
      }
    })


    React.render(<Receive />, document.body)
  }
})
