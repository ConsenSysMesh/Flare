package main

import (
	"log"
	"os/exec"
)

func startIPFS() {
	//start ipfs and report any errors...which there shouldn't be
	log.Println("starting ipfs...")
	exec.Command("bash", "-c", "ipfs daemon &").Start()
}

func stopIPFS() {
	exec.Command("bash", "-c", "kil $(ps -ef | grep '[i]pfs' | awk '{print $2}')").Run()
}
