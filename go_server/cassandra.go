package main

import (
	"fmt"
	"github.com/gocql/gocql"
	"log"
	"os/exec"
	"time"
)

type sessions struct {
	SessionID   string
	Coordinator string
	Duration    string
	Parameters  map[string]string
	Request     string
	StartedAt   time.Time
}
type events struct {
	SessionID     string
	EventID       string
	Activity      string
	Source        string
	SourceElapsed string
	Thread        string
	StartedAt     string
}

//getSessionLog returns the cassandra session log by scanning the database
func getSessionLog() string {

	// connect to the cluster
	cluster := gocql.NewCluster(config.Cassandra.IP)
	cluster.Keyspace = "system_traces"
	cluster.Consistency = gocql.Quorum
	session, err := cluster.CreateSession()
	if err != nil {
		panic(fmt.Sprintf("error creating session: %v", err))
	}
	defer session.Close()

	s := sessions{}

	var querySessions = `SELECT session_id, coordinator, duration, parameters, request, started_at FROM system_traces.sessions;`
	iter := session.Query(querySessions).Consistency(gocql.One).Iter()

	fmt.Println("Fetched sessions")
	var sOutput = ""
	for iter.Scan(&s.SessionID, &s.Coordinator, &s.Duration, &s.Parameters, &s.Request, &s.StartedAt) {
		//fmt.Println("Session: ", &s.SessionID, s.Coordinator, s.Duration, s.Parameters, s.Request, s.StartedAt)
		var param = "{"
		for paramKeys, paramValue := range s.Parameters {
			param = param + paramKeys + ": " + paramValue + ", "
		}

		param += "} "
		sOutput += "Session:\t" + s.SessionID + "\t" + s.Coordinator + "\t" + s.Duration + "\t" + param + "\t" + s.Request + "\t" + s.StartedAt.String() + "\n"
	}
	if err := iter.Close(); err != nil {
		log.Fatal(err)
	}
	log.Println(sOutput)
	return sOutput
}

//getTracingLog gets the tracing log by scanning the cql database
func getTracingLog() string {
	// connect to the cluster
	cluster := gocql.NewCluster(config.Cassandra.IP)
	cluster.Keyspace = "system_traces"
	cluster.Consistency = gocql.Quorum
	session, err := cluster.CreateSession()
	if err != nil {
		panic(fmt.Sprintf("error creating session: %v", err))
	}
	defer session.Close()

	e := events{}

	var queryEvents = `SELECT session_id, event_id, activity, source, source_elapsed, thread FROM system_traces.events;`
	iter := session.Query(queryEvents).Consistency(gocql.One).Iter()

	fmt.Println("Fetched events")
	var eOutput = ""
	for iter.Scan(&e.SessionID, &e.EventID, &e.Activity, &e.Source, &e.SourceElapsed, &e.Thread) {
		fmt.Println("Event: ", e.EventID, e.Activity, e.Source, e.SourceElapsed, e.Thread)
		eOutput += "Event: " + "\t" + e.EventID + "\t" + e.Activity + "\t" + e.Source + "\t" + e.SourceElapsed + "\t" + e.Thread + "\n"
	}
	if err := iter.Close(); err != nil {
		log.Fatal(err)
	}

	return eOutput
}

//initCassandra make cassandra ready for operations
func startCassandra() {
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
	cassie := config.Cassandra.Directory + "/bin/cassandra"

	_, err = exec.Command(cassie).CombinedOutput()
	if err != nil {
		log.Println("error with starting cassandra")
		log.Fatal(err.Error())
	}

	cqlsh := config.Cassandra.Directory + "/bin/cqlsh"
	out, err := exec.Command("bash", "-c", `echo "tracing on;" | `+cqlsh).CombinedOutput()
	log.Println(string(out))
}

func stopCassandra() {
	exec.Command("bash", "-c", "kill $(ps -ef | grep '[c]assandra' | awk '{print $2}')").Start()
}
