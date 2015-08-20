contract Market {

	struct Node {
		bytes32 state; //online, master, worker, offline
		bytes32 ipaddress;
		bytes32 appIdent;
		address coinbase;
		bytes32 name;
	}

	mapping (bytes32 => Node) nodes;
	bytes32[2**5] nodeList;
	uint32 public numNodes;

	//Parameters should be fields in the struct, then add it to the nodeList
	function createNode(bytes32 name, bytes32 state, bytes32 ipaddress) {
		nodes[name] = Node({name: name, state: state, ipaddress: ipaddress, appIdent:"", coinbase:msg.sender});
		nodeList[numNodes] = name;
		numNodes += 1;
	}

	function getState(bytes32 name) returns (bytes32) {
		return nodes[name].state;
	}

	function getIPAddress(bytes32 name) returns (bytes32){
		return nodes[name].ipaddress;
	}

	//TODO if there is time
	/*
	function removeNode() {
		// Remove node from list?
		// Remember to call penalizeNode if their state says that they are in the middle of an
		// application.
	}

	function penalizeNode(){
		//Penalize node if state of application isn't finished
		//Parameters: Something like address/hash, and then the amount penalized?
	}

	function setState(bytes32 name, bytes32 state) {
		nodes[name].state = state;
	}
	//we probably don't need that
	function setIPAddress(bytes32 name, bytes32 ipaddress) {
		nodes[name].ipaddress = ipaddress;
	}*/

	struct App {
		Node master;
		bytes32 ident;
		uint32 fee;
		bool on;
	}

	//Vars
	mapping (bytes32 => App) apps;
	bytes32[2**5] appList;
	uint32 public numApps;

	//	Parameter should be the driver nodes, amount of ethereum in escrow, escrow address
	//	(in the future, add the size of ddapp, memory needed, etc) to determine the
	//	most efficient processing.
	function createApp(bytes32 name, uint32 fee) {
		Node master;
		uint i;
		for(i =0; i < numNodes; i++) {
			master = nodes[nodeList[i]];
			if (master.state == "online") {
				master.state = "master";
				master.appIdent = name;
				break;
			}
		}
		apps[name]= App({master: master, ident: name, fee: fee, on: false});
		appList[numApps] = name;
		numApps += 1;

		for(i =0; i < numNodes && i < 5; i++) { //TODO: Get a better way of limiting nodes
			Node worker = nodes[nodeList[i]];
			if (worker.state == "online") {
				worker.state = "worker";
				worker.appIdent = name;
			}
		}
		//DDAP is not started a this point
	}

	function getFee(bytes32 name) returns (uint32) {
		return apps[name].fee;
	}

	function getMasterName(bytes32 appname) returns (bytes32) {
		return apps[appname].master.name;
	}

	function getOn(bytes32 name) returns (bool) {
		return apps[name].on;
	}

	function startApp(bytes32 nodename, bytes32 appname) {
		if (nodes[nodename].name == apps[appname].master.name)
			apps[appname].on = true;
	}

	function payNode(bytes32 appname, bytes32 nodename){
		nodes[nodename].coinbase.send(apps[appname].fee);
	}

	function DDAppFinished(bytes32 name) {
		for(var i =0; i < nodeList.length; i++) {
			nodes[nodeList[i]].state = "online";
			nodes[nodeList[i]].appIdent = "";
		}
	}
}
