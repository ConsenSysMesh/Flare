package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
)

type status struct {
	on bool
}

func startFlare() {
	//startup all the different asynchronous processes ,ORDER IS IMPORTANT
	startWebsockets()
	startSpark()
	startEthereum()
	startCassandra()
	startIPFS()
	log.Println("flare is ready")

	go func() {
		for {
			var bytes = masterWS.readBytesBlocking()
			log.Println("got master" + string(bytes))
		}
	}()

	go func() {
		for {
			var bytes = localWS.readBytesBlocking()
			log.Println("got local" + string(bytes))
			var data = map[string]interface{}{}
			if err := json.Unmarshal(bytes, &data); err != nil {
				panic(err)
			}
			if data["flag"] == "getlog" {
				var response = map[string]interface{}{}
				response["flag"] = "logdata"
				response["success"] = false
				response["type"] = data["type"]

				switch data["type"] {
				case "tracing":
					response["success"] = true
					response["text"] = getTracingLog()
				case "session":
					response["success"] = true
					response["text"] = getSessionLog()
				case "spark":
					text, err := getSparkLog()
					if err == nil {
						response["success"] = true
						response["text"] = text
					}
				case "sparkUI":
					text, err := getSparkUILog()
					if err == nil {
						response["success"] = true
						response["text"] = text
					}
				}

				var res, _ = json.Marshal(response)
				localWS.writeBytes(res)
			}
		}
	}()
}

//stopFlare can be called multiple times
func stopFlare() {
	//order is not as important here as in startFlare(), but still important
	stopIPFS()
	stopCassandra()
	log.Println("cass")
	stopEthereum()
	log.Println("ether")
	stopSpark()
	log.Println("spark")
	stopWebsockets()
	log.Println("and websockets")
}

func main() {
	var state = status{
		on: false,
	}

	initConfig()

	var command string
	for {
		fmt.Println("Ready for commands")
		reader := bufio.NewReader(os.Stdin)
		_command, _, _ := reader.ReadLine()
		command = string(_command)

		switch command {
		case "start":
			if !state.on {
				state.on = true
				startFlare()
			} else {
				fmt.Println("Flare has already been started")
			}
		case "stop":
			state.on = true
			if state.on {
				state.on = false
				stopFlare()
			} else {
				fmt.Println("Flare is not running")
			}
		}
	}
}
