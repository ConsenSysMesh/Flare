package main

import (
	"os/exec"
)

func initIPFS() {

	//start ipfs and report any errors...which there shouldn't be
	_, _ = exec.Command("ipfs", "daemon").CombinedOutput()
}
