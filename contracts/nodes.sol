contract nodesContract{

	struct node{
		//An ID number in form of hash
		//Ethereum address
		//TimeStamp?
		//State: Currently a master, worker for a ddap? Idle? dead?
		//spark ip address, we are asssuming default ports for now
		//cassandra ip address
		//IPFS address
		//Address to the insurance escrow account
		//If they are a receiving node:
			//worker memory
			//worker cores
		//Add a reputation, don't need to implement it, but it'll be nice		
	}
	
	struct insuranceEscrow{
		//	ID for the insurance escrow
		//	Origin address
		//	Perhaps who else can access it?? Not sure about this one
	}

	mapping (uint => node) nodeList;

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

	//setter and getter methods. Add necessary ones
}
