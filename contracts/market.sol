

contract marketContract{

	struct node{
		bytes32 state; //online, master, worker, offline
		bytes32 ipaddress;
		bytes32 sparkPort;
		bytes32 cassandraPort;
		bytes32 ipfsPort;
		bool start; //used to signal all workers to begin
	}

	mapping (bytes32 => node) nodes;
	node[2**20] nodeList;
	uint numNodes;

	//Parameters should be fields in the struct, then add it to the nodeList
	function newNode(){
		//	bunch of setter, try to call setter methods instead of hardcoding it for more
		//	flexibility

		//	final append to nodeList
	}

	function removeNode(){
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
	function setIPAddress(bytes32 name, bytes32 ipaddress) {
		nodes[name].ipaddress = ipaddress;
	}
	function setSparkPort(bytes32 name, bytes32 port) {
		nodes[name].sparkPort = port;
	}
	function setCassandraPort(bytes32 name, bytes32 port) {
		nodes[name].cassandraPort = port;
	}
	function setIPFSPort(bytes32 name, bytes32 port) {
		nodes[name].ipfsPort = port;
	}

	struct App{
		node master;
		node[] workers;
		uint fee;
	}

	//Vars
	mapping (bytes32 => App) apps;
	App[2**20] appList;
	uint numApps;

	//	Parameter should be the driver nodes, amount of ethereum in escrow, escrow address
	//	(in the future, add the size of ddapp, memory needed, etc) to determine the
	//	most efficient processing.
	function createDDApp(bytes32 name, uint fee){
		setMasterNode(name);
		setReceiverNodes(name);
		apps[name].fee = fee;

		//DDAP is not started yet
	}

	function setMasterNode(bytes32 name) {
		for(var i =0; i < nodeList.length; i++) {
			if (nodeList[i].state == "online") {
				nodeList[i].state = "master";
				apps[name].master = nodeList[i];
				return;
			}
		}
	}

	function setReceiverNodes(bytes32 name) {
		for(var i =0; i < nodeList.length && i < 5; i++) { //TODO: Get a better way of limiting nodes
			node[2**20] workers;
			uint numWorkers;
			if (nodeList[i].state == "online") {
				nodeList[i].state = "worker";
				workers[numWorkers] = nodeList[i];
				numWorkers += 1;
			}
		}
		apps[name].workers = workers;
	}

	function DDAppFinished(bytes32 name) {
		for(var i =0; i < apps[name].workers.length; i++) {
			apps[name].workers[i].state = "online";
		}
	}
}
