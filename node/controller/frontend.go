package main

import (
	"log"
	"os/exec"
)

func startFrontend() {
	log.Println("starting flare frontend...")
	exec.Command("bash", "-c", "cd "+config.Flare.Directory+"/frontend_meteor && meteor -p 35273").Start()
	log.Println("frontend available on port 35273")
}

func stopFrontend() {
	//TODO: stop meteor frontend somehow
}
