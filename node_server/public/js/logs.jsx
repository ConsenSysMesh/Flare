var Logs = React.createClass({
	displayName: "Logs",
	render: function(){
		return(
			<div className='outline'>
				<h3>Logs</h3>
				<div className='row'>
					<div id="log-select" class="row text-center">
            <label for="spark-ui">
              <input id="spark-ui" name="token" type="radio" value="spark-ui"/>
              <span>Spark UI</span>
            </label>

            <label for="spark">
              <input id="spark" name="token" type="radio" value="spark"/>
              <span>Spark</span>
              </label>
            <label for="tracing">
              <input id="tracing" name="token" type="radio" value="tracing"/>
              <span>Tracing</span>
            </label>

            <label for="system">
              <input id="system" name="token" type="radio" value="system"/>
              <span>System</span>
            </label>
	        </div>
				</div>
			</div>
		)
	}
})
