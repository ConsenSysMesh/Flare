// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"
	"net"
	"sync"
	//"net/http"
	"net/url"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write the file to the client.
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the client.
	pongWait = 60 * time.Second
	// Send pings to client with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
	// Poll file for changes with this period.
	filePeriod = 10 * time.Second
)

type websocketInstance struct {
	socket    *websocket.Conn
	readChan  chan []byte
	writeChan chan []byte
}

type websocketInterface interface {
	readBlocking() string
	readBytesBlocking() []byte
	write(message string)
	writeBytes(message []byte)
}

var localWS = websocketInstance{
	readChan:  make(chan []byte),
	writeChan: make(chan []byte),
}

var masterWS = websocketInstance{
	readChan:  make(chan []byte),
	writeChan: make(chan []byte),
}

var bufferSize = 1024

func (wi *websocketInstance) readBlocking() string {
	raw := wi.readBytesBlocking()
	s := string(raw[:len(raw)])

	return s
}

func (wi *websocketInstance) readBytesBlocking() []byte {
	raw := <-wi.readChan
	return raw
}

func (wi *websocketInstance) readHandler() {
	wi.socket.SetReadLimit(512)
	wi.socket.SetReadDeadline(time.Now().Add(pongWait))
	wi.socket.SetPongHandler(func(string) error { wi.socket.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := wi.socket.ReadMessage()
		if err != nil {
			break
		}
		wi.readChan <- message
	}
}

func (wi *websocketInstance) write(message string) {
	wi.writeBytes([]byte(message))
}

func (wi *websocketInstance) writeBytes(message []byte) {
	wi.writeChan <- message
}

func (wi *websocketInstance) writeHandler() {
	pingTicker := time.NewTicker(pingPeriod)
	defer func() {
		pingTicker.Stop()
		wi.socket.Close()
	}()

	for {
		select {
		case <-pingTicker.C:
			wi.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := wi.socket.WriteMessage(websocket.PingMessage, []byte{}); err != nil {

				log.Fatal(err)
			}
		case message := <-wi.writeChan:
			wi.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := wi.socket.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Fatal(err)
			}
		}
	}
}

func initWebsockets(waitGroup *sync.WaitGroup) {
	localConn, err := net.Dial("tcp", "127.0.0.1:35273")
	if err != nil {
		log.Println("Problem with creating connection " + err.Error())
		return
	}
	localSite, err := url.Parse("ws://127.0.0.1:35273/")

	localSocket, _, err := websocket.NewClient(localConn, localSite, nil, bufferSize, bufferSize)
	localWS.socket = localSocket

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
			log.Println("v ...interface{}")
		}
		return
	}

	masterConn, err := net.Dial("tcp", "127.0.0.1:38477")
	if err != nil {
		log.Println("Problem with creating connection " + err.Error())
		return
	}
	masterSite, err := url.Parse("ws://127.0.0.1:38477/")

	masterSocket, _, err := websocket.NewClient(masterConn, masterSite, nil, bufferSize, bufferSize)
	masterWS.socket = masterSocket

	waitGroup.Add(2)
	go localWS.writeHandler()
	go masterWS.writeHandler()
	localWS.write("{\"flag\":\"identify\", \"name\":\"goserver\"}")
	masterWS.write("{\"flag\":\"identify\", \"name\":\"goserver\"}")
	go localWS.readHandler()
	go masterWS.readHandler()
}
