var Logs = React.createClass({
	displayName: "Logs",
	render: function(){
		return(
			<div className='outline'>
				<h3>Logs</h3>
				<div className='row'>
					<div id="log-select" class="row text-center">
	          <h3 id="tokenerror"></h3>
	          <div class="col-xs-6">
	            <label for="brick">
	              <input id="brick" name="token" type="radio" value="AaLWdxW4mCB4Z7i2nW5ocgM6cT7jWEybcD"/>
	              <span>Brick</span>
	            </label>

	            <label for="steak">
	              <input id="steak" name="token" type="radio" value="AVBLsxjac7LCYxiXcMnUAricYxVq1YgbkZ"/>
	              <span>Steak</span>
	              </label>
	          </div>
	          <div class="col-xs-6">
	            <label for="bitcoin">
	              <input id="bitcoin" name="token" type="radio" value="AL9VwZMgDQ2bqLXorU2bJoiMu3MjamZQFm"/>
	              <span>Bitcoin</span>
	            </label>

	            <label for="phone">
	              <input id="phone" name="token" type="radio" value="AcPeTwYT5s2xJmXpDCuMr3JWGvJ9vEMkNF"/>
	              <span>Phone</span>
	            </label>
	          </div>
	        </div>
				</div>
			</div>
		)
	}
})
