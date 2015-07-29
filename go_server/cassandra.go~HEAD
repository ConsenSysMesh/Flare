package main

import (
	"log"
	"os/exec"
)

func initCassandra() {

	//write the config for cassandra
	cassandraConfigName := config.Cassandra.Directory + "/conf/cassandra.yaml"

	cassandraListenIP := "'s/.*listen_address:.*/listen_address: " + config.Cassandra.IP + "/'"
	cassandraRPCIP := "'s/.*rpc_address:.*/rpc_address: " + config.Cassandra.IP + "/'"
	cassandraPort := "'s/.*rpc_port:.*/rpc_port: " + config.Cassandra.Port + "/'"

	_, err := exec.Command("bash", "-c", "sed"+" -i.bak "+cassandraListenIP+" "+cassandraConfigName).CombinedOutput()
	_, err = exec.Command("bash", "-c", "sed"+" -i.bak "+cassandraRPCIP+" "+cassandraConfigName).CombinedOutput()
	if err != nil {
		log.Println("error with setting cassandra ip")
		log.Fatal(err.Error())
	}

	_, err = exec.Command("bash", "-c", "sed"+" -i.bak "+cassandraPort+" "+cassandraConfigName).CombinedOutput()
	if err != nil {
		log.Println("error with setting cassandra port")
		log.Fatal(err.Error())
	}

	//start the cassandra and report any errors
	master := config.Cassandra.Directory + "/bin/cassandra"

	_, err = exec.Command(master).CombinedOutput()
	if err != nil {
		log.Println("error with starting cassandra")
		log.Fatal(err.Error())
	}

}
