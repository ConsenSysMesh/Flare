package main

type publishments struct {
	configChan chan []byte
}

var publish = publishments{
	configChan: make(chan []byte),
}
