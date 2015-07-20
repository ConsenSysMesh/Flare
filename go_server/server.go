package main

import (
	"encoding/json"
	"fmt"
	"sync"
)

func main() {

	//this isn't needed now, but may be in the future
	waitGroup := new(sync.WaitGroup)
	waitGroup.Add(1)

	//startup all the different asynchronous processes ,ORDER IS IMPORTANT
	initConfig()
	initWebsockets(waitGroup)
	initSpark()
	initEthereum(waitGroup)

	for {
		var bytes = readBytesBlocking()
		var data = map[string]interface{}{}
		if err := json.Unmarshal(bytes, &data); err != nil {
			panic(err)
		}
		if data["flag"] == "getlog" {
			var response = map[string]interface{}{}
			response["flag"] = "logdata"
			response["success"] = false

			fmt.Println(data)
			if data["name"] == "tracing" {
				response["success"] = true
				response["text"] = getTracingLog("127.0.0.1")
			}
			if data["name"] == "session" {
				response["success"] = true
				response["text"] = getSessionLog("127.0.0.1")
			}
			if data["name"] == "spark" {
				text, err := getSparkLog()
				if err == nil {
					response["success"] = true
					response["text"] = text
				}
			}
			if data["name"] == "spark-ui" {
				text, err := getSparkUILog()
				if err == nil {
					response["success"] = true
					response["text"] = text
				}
			}

			var res, _ = json.Marshal(response)
			//fmt.Println(res)
			writeBytes(res)
		}
	}

	//waitGroup.Wait()
}
