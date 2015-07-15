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
	displayName: "Logs",
	render: function(){
		return(
			<div className='outline'>
				<h3>Logs</h3>
				{logSelect}
				{logData}
			</div>
		)
	}
})
