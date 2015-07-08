var webSocket;
var messages = $("#messages");
console.log("awake");
function openSocket(){
  // Ensures only one connection is open at a time
  if(webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED){
    writeResponse("WebSocket is already opened.");
    return;
  }
  // Create a new instance of the websocket
  webSocket = new WebSocket("ws://localhost:38477");

  console.log("ad");
  /**
  * Binds functions to the listeners for the websocket.
  */
  webSocket.onopen = function(event){
    // For reasons I can't determine, onopen gets called twice
    // and the first time event.data is undefined.
    // Leave a comment if you know the answer.
    if(event.data === undefined)
    return;

    writeResponse(event.data);
  };

  webSocket.onmessage = function(event){
    writeResponse(event.data);
  };

  webSocket.onclose = function(event){
    writeResponse("Connection closed");
  };
}

/**
* Sends the value of the text input to the server
*/
function send(){
  var text = $("#messageinput").value;
  webSocket.send(text);
}

function closeSocket(){
  webSocket.close();
}

function writeResponse(text){
  messages.innerHTML += "<br/>" + text;
}
