package main

import (
	"bufio"
	"fmt"
	"github.com/gocql/gocql"
	"log"
	//"reflect"
	"os"
	"time"
)

//type sessions struct {
//	Session_id  gocql.UUID
//	Coordinator string
//	Duration    int
//	Parameters  map[string]string
//	Request     string
//	Started_at  time.Time
//}

type sessions struct {
	Session_id  string
	Coordinator string
	Duration    string
	Parameters  map[string]string
	Request     string
	Started_at  time.Time
}
type events struct {
	Session_id     string
	Event_id       string
	Activity       string
	Source         string
	Source_elapsed string
	Thread         string
	Started_at     string
}

func main() {
	//Get environmental variables
	//Please set env variable SESSLOGS
	var log_folder = os.Getenv("SESSLOGS")
	// connect to the cluster
	cluster := gocql.NewCluster("172.31.28.240")
	cluster.Keyspace = "system_traces"
	cluster.Consistency = gocql.Quorum
	session, err := cluster.CreateSession()
	if err != nil {
		panic(fmt.Sprintf("error creating session: %v", err))
	}
	defer session.Close()

	s := sessions{}
	e := events{}

	//Creating files to be loaded onto IPFS
	sessions_file, err := os.Create(log_folder + "/sessions_file")
	if err != nil {
		log.Fatal(err)
	}
	events_file, err := os.Create(log_folder + "/events_file")
	if err != nil {
		log.Fatal(err)
	}
	sf := bufio.NewWriter(sessions_file)
	ef := bufio.NewWriter(events_file)

	defer sessions_file.Close()
	defer events_file.Close()
	defer sf.Flush()
	defer ef.Flush()

	//Checking types
	//fmt.Println("The type of parameter is: ", reflect.TypeOf(s.Session_id))

	var query_sessions = `SELECT session_id, coordinator, duration, parameters, request, started_at FROM system_traces.sessions;`
	iter := session.Query(query_sessions).Consistency(gocql.One).Iter()

	fmt.Println("Fetched sessions")
	for iter.Scan(&s.Session_id, &s.Coordinator, &s.Duration, &s.Parameters, &s.Request, &s.Started_at) {
		//fmt.Println("Session: ", &s.Session_id, s.Coordinator, s.Duration, s.Parameters, s.Request, s.Started_at)
		var param = "{"
		for param_keys, param_value := range s.Parameters {
			param = param + param_keys + ": " + param_value + ", "
		}

		param += "} "
		var s_output = "Session:\t" + s.Session_id + "\t" + s.Coordinator + "\t" + s.Duration + "\t" + param + "\t" + s.Request + "\t" + s.Started_at.String() + "\n"
		sf.WriteString(s_output)
	}
	if err := iter.Close(); err != nil {
		log.Fatal(err)
	}
	var query_events = `SELECT session_id, event_id, activity, source, source_elapsed, thread FROM system_traces.events;`
	iter2 := session.Query(query_events).Consistency(gocql.One).Iter()

	fmt.Println("Fetched events")
	for iter2.Scan(&e.Session_id, &e.Event_id, &e.Activity, &e.Source, &e.Source_elapsed, &e.Thread) {
		//fmt.Println("Event: ", e.Event_id, e.Activity, e.Source, e.Source_elapsed, e.Thread)
		var e_output = "Event: " + "\t" + e.Event_id + "\t" + e.Activity + "\t" + e.Source + "\t" + e.Source_elapsed + "\t" + e.Thread + "\n"
		ef.WriteString(e_output)
	}
	if err := iter2.Close(); err != nil {
		log.Fatal(err)
	}
}
