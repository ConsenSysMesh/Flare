package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
)

type configuration struct {
	Cassandra struct {
		Directory string `json:"directory"`
		IP        string `json:"ip"`
		Password  string `json:"password"`
		Port      string `json:"port"`
		Username  string `json:"username"`
	} `json:"cassandra"`
	Flare struct {
		Address   string `json:"address"`
		Directory string `json:"directory"`
		Local     struct {
			IP   string `json:"ip"`
			Port string `json:"port"`
		} `json:"local"`
		Master struct {
			IP   string `json:"ip"`
			Port string `json:"port"`
		} `json:"master"`
		Price string `json:"price"`
	} `json:"flare"`
	Spark struct {
		Cores     string `json:"cores"`
		Directory string `json:"directory"`
		Log4J     struct {
			ConversionPattern string `json:"conversionPattern"`
			Appender          string `json:"appender"`
			Directory         string `json:"directory"`
			Layout            string `json:"layout"`
			MaxFileSize       string `json:"maxFileSize"`
			RootCategory      string `json:"rootCategory"`
		} `json:"log4j"`
		Master struct {
			IP   string `json:"ip"`
			Port string `json:"port"`
		} `json:"master"`
		Price          string `json:"price"`
		ReceiverMemory string `json:"receiverMemory"`
	} `json:"spark"`
}

var config = &configuration{}

func setConfigBytes(_config []byte) {
	if err := json.Unmarshal(_config, &config); err != nil {
		log.Println("error with parsing config json")
		panic(err)
	}
}

func getConfigBytes() []byte {
	var _config, _ = json.Marshal(config)
	return _config
}

func initConfig() {
	//get the configuration using the system env variable
	confLoc := os.Getenv("FLARECONF")
	_config, _ := ioutil.ReadFile(confLoc)
	setConfigBytes(_config)
}

func saveConfig() {
	confLoc := os.Getenv("FLARECONF")
	var _config, _ = json.MarshalIndent(config, "", "  ")
	ioutil.WriteFile(confLoc, _config, os.ModePerm)
}
