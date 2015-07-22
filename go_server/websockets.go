// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"
	"net"
	"net/url"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write the file to the client.
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the client.
	pongWait = 60 * time.Second
	// Send pings to client with this period. Must be less than pongWait.
	pingPeriod = 5 * time.Second
)

type websocketInstance struct {
	socket     *websocket.Conn
	readChan   chan []byte
	writeChan  chan []byte
	pingTicker *time.Ticker
}

type websocketInterface interface {
	readBlocking() string
	readBytesBlocking() []byte
	readHandler()
	write(message string)
	writeBytes(message []byte)
	writeHandler()
	init()
}

var localWS = websocketInstance{
	readChan:   make(chan []byte),
	writeChan:  make(chan []byte),
	pingTicker: time.NewTicker(pingPeriod),
}

var masterWS = websocketInstance{
	readChan:   make(chan []byte),
	writeChan:  make(chan []byte),
	pingTicker: time.NewTicker(pingPeriod),
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
			log.Println(err)
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
	defer func() {
		wi.pingTicker.Stop()
		wi.socket.Close()
		wi.init()
	}()

	for {
		select {
		case <-wi.pingTicker.C:
			wi.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := wi.socket.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				log.Println(err)
				return
			}
		case message := <-wi.writeChan:
			wi.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := wi.socket.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func (wi *websocketInstance) init() {
	if *wi == localWS {
		initLocalWS()
	}
	if *wi == masterWS {
		initMasterWS()
	}
}

func initLocalWS() {
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

	go localWS.writeHandler()
	localWS.write("{\"flag\":\"identify\", \"name\":\"goserver\"}")
	go localWS.readHandler()
}

func initMasterWS() {
	masterConn, err := net.Dial("tcp", "127.0.0.1:38477")
	if err != nil {
		log.Println("Problem with creating connection " + err.Error())
		return
	}
	masterSite, err := url.Parse("ws://127.0.0.1:38477/")

	masterSocket, _, err := websocket.NewClient(masterConn, masterSite, nil, bufferSize, bufferSize)
	masterWS.socket = masterSocket

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
			log.Println("v ...interface{}")
		}
		return
	}

	go masterWS.writeHandler()
	masterWS.write("{\"flag\":\"identify\", \"name\":\"goserver\"}")
	go masterWS.readHandler()
}

func initWebsockets(waitGroup *sync.WaitGroup) {
	localWS.init()
	masterWS.init()

	waitGroup.Add(4)
}
