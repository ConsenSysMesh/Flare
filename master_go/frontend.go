package main

import (
	"log"
	"os/exec"
)

func startFrontend() {
	go testFront()
}

func testFront() {
	log.Println("starting flare frontend...")
	exec.Command("bash", "-c", "cd "+config.Flare.Directory+"/frontend_meteor; meteor -p 35273").Run()
	log.Println("frontend available on port 35273")
}

func stopFrontend() {
	//TODO: stop meteor frontend somehow
}
