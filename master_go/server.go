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
	startSpark()
	startEthereum()
	startCassandra()
	startIPFS()
	startWebsockets()
	startFrontend()
	log.Println("flare is ready")

	go func() {
		for {
			var bytes = masterWSClient.readBytesBlocking()
			log.Println("got master" + string(bytes))
		}
	}()

	go func() {
		for {
			_config := <-publish.configChan

			var response = map[string]interface{}{}
			response["flag"] = "config"
			response["text"] = string(_config)
			var res, _ = json.Marshal(response)
			localWSServer.writeBytes(res)
		}
	}()

	go func() {
		for {
			var bytes = localWSServer.readBytesBlocking()
			log.Println("got local" + string(bytes))
			var data = map[string]interface{}{}
			if err := json.Unmarshal(bytes, &data); err != nil {
				panic(err)
			}

			var response = map[string]interface{}{}
			if data["flag"] == "getLog" {
				response["flag"] = "log"
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
				localWSServer.writeBytes(res)
			}
			if data["flag"] == "setConfig" {
				log.Println(data["text"])
				saveConfig([]byte(data["text"].(string)))
			}
			if data["flag"] == "getConfig" {
				response["flag"] = "config"
				var _config = getConfigBytes()
				response["text"] = string(_config)
				var res, _ = json.Marshal(response)
				localWSServer.writeBytes(res)
			}
			if data["flag"] == "sparkSubmit" {
				success := sparkSubmit(data)

				response["flag"] = "sparkSubmit"
				response["id"] = data["id"]
				response["success"] = success
				var res, _ = json.Marshal(response)
				localWSServer.writeBytes(res)
			}
		}
	}()
}

//stopFlare can be called multiple times
func stopFlare() {
	//order is not as important here as in startFlare(), but still important
	stopFrontend()
	stopWebsockets()
	stopIPFS()
	stopCassandra()
	stopEthereum()
	stopSpark()
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
			if state.on {
				state.on = false
				stopFlare()
			} else {
				fmt.Println("Flare is not running")
			}
		case "restart":
			stopFlare()
			initConfig()
			startFlare()
		}
	}
}
