var logSelect = (
	<div id="log-select" class="row text-center">
		<label htmlFor="spark-ui">
			<input id="spark-ui" name="logtype" type="radio" value="spark-ui"/>
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

var logData = (
	<div id="logData">

	</div>
);

var Logs = React.createClass({
	render: function(){
		return(
			<div>
				<Navbar/>
				<Sidebar path={window.location.pathname}/>
				<div id="logs-page">
					<h3>Logs</h3>
					{logSelect}
					{logData}
				</div>
			</div>
		)
	}
})

localWS.onmessage = function(evt){
	console.log(evt.data);
	var data = $.parseJSON(evt.data)
	if (data.flag == "logdata" && data.success == true){
		$("#logData").text(data.text)
	}
}

React.render(<Logs />, document.body)

$('#log-select input[type=radio]').click(function() {
	$('#log-select label').toggleClass('checked', false);
	$(this).parent().toggleClass('checked', this.checked);

	localWS.send('{"flag": "getlog", "name":"'+$("input[name=logtype]:checked").val()+'"}');
});
