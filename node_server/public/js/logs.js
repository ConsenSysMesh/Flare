var ws = new WebSocket('ws://127.0.0.1:38477');


$('#log-select input[type=radio]').click(function() {
	$('#log-select label').toggleClass('checked', false);
	$(this).parent().toggleClass('checked', this.checked);

	ws.send('{"flag": "identify", "name":"frontend"}');
	ws.send('{"flag": "getlog", "name":"'+$("input[name=logtype]:checked").val()+'"}');

	ws.onmessage = function(evt){
		var data = JSON.parse(evt.data)
		if (data.flag == "logdata" && data.success == true){
			$("#logData").text(data.text)
		}
	};
});
