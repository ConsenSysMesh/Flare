/*Contains functions for the operation of and interaction with Cassandra*/

package main

import (
	"fmt"
	"github.com/gocql/gocql"
	"log"
	"os/exec"
	"reflect"
	"strings"
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

var nodeInfoTicker = time.NewTicker(5 * time.Second)
var nodeRingTicker = time.NewTicker(5 * time.Second)

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

//Use the cassandra nodetool to get state information
func publishNodeInfo() {
	out, _ := exec.Command(config.Cassandra.Directory+"/bin/nodetool", "info").CombinedOutput()

	var data = map[string]interface{}{}
	params := strings.Split(string(out), "\n")

	//iterate through every line of output, skipping the last blank line
	for i, param := range params {
		if i == len(params)-1 {
			break
		}
		_param := strings.Split(param, ":")
		var key = strings.TrimSpace(_param[0])
		var val = strings.TrimSpace(_param[1])
		data[key] = val
	}

	var info = map[string]interface{}{
		"ID":           data["ID"],
		"gossipActive": data["Gossip active"],
		"thriftActive": data["Thrift active"],
		"uptime":       data["Uptime (seconds)"],
		"heapMemory":   data["Heap Memory (MB)"],
	}

	if !reflect.DeepEqual(info, publish.cassandraNodeInfo) {
		publish.cassandraNodeInfo = info
		publish.cassandraNodeInfoChan.In() <- info
	}
}

func publishNodeRing() {
	out, _ := exec.Command(config.Cassandra.Directory+"/bin/nodetool", "ring").CombinedOutput()

	var ring = []map[string]interface{}{}
	params := strings.Split(string(out), "\n")
	//iterate through every line of output, skipping the last blank line
	for _, param := range params {
		if param == "" {
			continue
		}
		_param := strings.Fields(param)
		if _param[0] != config.Cassandra.IP {
			continue
		}
		ring = append(ring, map[string]interface{}{
			"address": _param[0],
			"status":  _param[2],
			"state":   _param[3],
			"owns":    _param[6],
			"token":   _param[7],
		})
	}

	if !reflect.DeepEqual(ring, publish.cassandraNodeRing) {
		publish.cassandraNodeRing = ring
		publish.cassandraNodeRingChan.In() <- ring
	}
}

//initCassandra make cassandra ready for operations
func startCassandra() {
	log.Println("starting cassandra...")
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

	go func() {
		for {
			select {
			case <-nodeInfoTicker.C:
				publishNodeInfo()
			case <-nodeRingTicker.C:
				publishNodeRing()
			}
		}
	}()
}

func stopCassandra() {
	exec.Command("bash", "-c", "kill $(ps -ef | grep '[c]assandra' | awk '{print $2}')").Start()
}
