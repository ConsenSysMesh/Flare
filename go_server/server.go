package main

import (
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"time"
)

var REACTSERVER string = "http://127.0.0.1:3000"
var TIMEOUT time.Duration = time.Duration(2 * time.Second)

var transport http.Transport

func reactHandler(w http.ResponseWriter, req *http.Request) {
	client := http.Client{
		Transport: &transport,
	}
	module := url.QueryEscape(req.FormValue("module"))
	props := url.QueryEscape(req.FormValue("props"))

	url, _ := url.Parse(REACTSERVER + "/?module=" + module + "&props=" + props)

	resp, err := client.Get(url.String())

	if err != nil {
		log.Print("Error: " + err.Error())
	} else {
		cont, _ := ioutil.ReadAll(resp.Body)
		w.Write(cont)
	}

}

func dialTimeout(network, addr string) (net.Conn, error) {
	return net.DialTimeout(network, addr, TIMEOUT)
}

func main() {
	http.HandleFunc("/react", reactHandler)

	reactserver := os.Getenv("REACT_SERVER")

	if reactserver != "" {
		REACTSERVER = reactserver
	}

	transport = http.Transport{
		Dial: dialTimeout,
	}

	port := os.Getenv("REACT_GO_PORT")
	if port == "" {
		port = "4040"
	}
	log.Print("INFO: Starting on port ", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

}
