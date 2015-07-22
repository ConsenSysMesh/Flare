package main

import (
	"os/exec"
)

func initIPFS() {

	//start ipfs and report any errors
	_, _ = exec.Command("ipfs", "daemon").CombinedOutput()
}
