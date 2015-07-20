//	Importing things from nodes.sol
//	This is how Gnosis does importing on testrpc
//	Not sure if this is correct
contract nodesContract {
	//All of nodesContracts functions
	//Below is an example
  	function e_exp(uint x) returns(uint);
  	function ln(uint x) returns(uint);
}
	
contract marketContract{

	struct DDApp{
		//An ID number in form of hash
		//Link to escrow Ethereum address
		//Driver node (who submitted the application)?
		//Master node (who is running the operation)?
		//Worker node list (group of nodes processing)?
		//spark ip address, we are asssuming default ports for now
		//cassandra ip address
		//IPFS address
		//If they are a receiving node:
			//worker memory
			//worker cores
		//Add a reputation, don't need to implement it, but it'll be nice		
	}

	//Vars
	mapping (uint => DDApp) DDAppList;

	//	Parameter should be the driver nodes, amount of ethereum in escrow, escrow address
	//	(in the future, add the size of ddapp, memory needed, etc) to determine the
	//	most efficient processing.
	function newDDApp(){
		//	Runs necessary methods:
		//		findMasterNode();
		//		findReceiverNodes();
		//		newDDAppEscrow();
		//		newInsuranceEscrow();

		//	Notice that there is two escrow accounts, one by the origin which pays everyone else
		//	and the other is a list of master + workers escrows.
		
		//	Should return back success or failure
		//	Not quite sure if it should return back DDApp hash? 
		//	Finally should run the function "startDDApp"
		return;
	}
	
	function startDDApp(){
		// 	Start DDApp. Send notice to the master worker and all of the
		// 	workers.

		// 	Send them details of the node which has the cassandra instance that contains the 
		// 	data. 
	}

	function findMasterNode(){
		//	Run through the node list and return appropriate
		//	address or hash for master node.
		return;
	}

	function findReceiverNodes(){
		//  Run through the node list and return a list of worker nodes
		//	Remember to add this list to the worker node list of the DDApp struct
	}

	function DDAppFinished(){
		//	Remove application
		//	You have to go through every node and tell them to stop listening
		//	Pay everyone off
	}

	//Setter and getter methods
}
