package main

import (
	"encoding/json"
	"log"
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
	log.Println("cassandra")
	initCassandra()
	log.Println("ipfs")
	initIPFS()

	go func() {
		for {
			var bytes = masterWS.readBytesBlocking()
			log.Println("got master" + string(bytes))
		}
	}()

	log.Println("flare is ready")
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

			if data["name"] == "tracing" {
				response["success"] = true
				response["text"] = getTracingLog()
			}
			if data["name"] == "session" {
				response["success"] = true
				response["text"] = getSessionLog()
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
			localWS.writeBytes(res)
		}
	}

	//waitGroup.Wait()
}
