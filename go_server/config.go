package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
)

type configuration struct {
	Cassandra struct {
		Directory string
		Password  string
		Username  string
	}
	Flare struct {
		Address        string
		Cores          string
		Directory      string
		Price          string
		ReceiverMemory string
	}
	Spark struct {
		Directory string
		Master    struct {
			IP   string
			Port string
		}
		Log4j struct {
			ConversionPattern string
			Appender          string
			Directory         string
			Layout            string
			MaxFileSize       string
			RootCategory      string
		}
	}
}

var config = &configuration{}

func initConfig() {
	//get the configuration using the system env variable
	confLoc := os.Getenv("FLARECONF")
	confLocBytes, _ := ioutil.ReadFile(confLoc)
	if err := json.Unmarshal(confLocBytes, &config); err != nil {
		log.Println("error with parsing config json")
		panic(err)
	}
}
