/*Manages the global configuration stuct and maintains consistency between the config variable and the json on the filesystem */

package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"reflect"
	"time"
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
		Price          string `json:"price"`
		FilesDirectory string `json:"filesDirectory"`
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

var config = new(configuration)
var configTicker = time.NewTicker(5 * time.Second)

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

func saveConfig(raw []byte) {
	var _config = new(configuration)
	if err := json.Unmarshal(raw, &_config); err != nil {
		log.Println("error with parsing config json")
		panic(err)
	}
	data, _ := json.MarshalIndent(_config, "", "    ")
	confLoc := os.Getenv("FLARECONF")
	ioutil.WriteFile(confLoc, data, os.ModePerm)
}

func readAndSetConfig() {
	var lastMod = time.Date(1, time.January, 1, 1, 1, 1, 1, time.Local)
	//get the configuration using the system env variable
	confLoc := os.Getenv("FLARECONF")
	for {
		select {
		case <-configTicker.C:
			_config, _lastMod, _ := readFileBytesIfModified(lastMod, confLoc)

			if _lastMod.After(lastMod) {
				lastMod = _lastMod

				setConfigBytes(_config)

				if !reflect.DeepEqual(config, _config) {
					publish.config = _config
					publish.configChan.In() <- _config
				}
			}
		}
	}
}

func initConfig() {
	confLoc := os.Getenv("FLARECONF")
	_config, _ := readFileBytes(confLoc)

	setConfigBytes(_config)
	go readAndSetConfig()
}
