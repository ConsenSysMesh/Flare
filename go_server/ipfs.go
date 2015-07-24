package main

import (
	"os/exec"
)

func initIPFS() {

	//start ipfs and report any errors...which there shouldn't be
	exec.Command("ipfs", "daemon").Start()
}
