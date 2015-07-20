package main

import (
	"bufio"
	"fmt"
	"github.com/gocql/gocql"
	"io/ioutil"
	"log"
	//"reflect"
	"os"
	"time"
)

//type sessions struct {
//	SessionID  gocql.UUID
//	Coordinator string
//	Duration    int
//	Parameters  map[string]string
//	Request     string
//	StartedAt  time.Time
//}

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

func getSessionLog(ipaddr string) string {

	// connect to the cluster
	cluster := gocql.NewCluster(ipaddr)
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

func getTracingLog(ipaddr string) string {
	// connect to the cluster
	cluster := gocql.NewCluster(ipaddr)
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

func getCassandraLogs(ipaddr string) (string, string) {
	return getSessionLog(ipaddr), getTracingLog(ipaddr)
}

func writeSparkLogs(source string, logFolder string, ipaddr string) {

	text, err := ioutil.ReadFile(source)

	//Creating files to be loaded onto IPFS
	sparkFile, err := os.Create(logFolder + "/sparkFile")
	if err != nil {
		log.Fatal(err)
	}

	fileWriter := bufio.NewWriter(sparkFile)

	defer sparkFile.Close()
	defer fileWriter.Flush()

	fileWriter.Write(text)
}

func getSparkLog() ([]byte, error) {
	source := ""
	text, err := ioutil.ReadFile(source)

	return text, err
}
func getSparkUILog() ([]byte, error) {
	source := ""
	text, err := ioutil.ReadFile(source)

	return text, err
}
