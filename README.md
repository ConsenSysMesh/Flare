#Flare

Flare is the (uncontested) first implementation of decentralized computing with Ethereum. The goal is to use Apache Spark and Cassandra, two technologies designed for cluster computation, and integrate a connection with Ethereum to provide trusted, verifiably correct, computation in untrusted systems. This will allow anyone with internet access to run code in a distributed decentralized processing network.

Right now we are designing a system that can operate in semi-trusted environments, where no actor is actively trying to game the system. This implementation requires a frontend to fasciliate the configuration of Spark and Cassandra, submitting computations to Spark, and monitoring computations being processed.

We use multiple frameworks and languages in this program: Meteor, React, Spark, Cassandra, IPFS, Go. We attempted to choose the best angle of attack for each problem, all the technologies used are in active development and will improve as Flare improves, ideally compounding the efficiency of the system. In the case of IPFS one day IPFS will replace Cassandra for all storage requirements. It provides more user friendly interaction and is designed for file storage in untrusted systems.
