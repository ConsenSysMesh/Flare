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
	pingPeriod = 3 * time.Second
)

type websocketInstance struct {
	socket     *websocket.Conn
	readChan   chan []byte
	writeChan  chan []byte
	pingTicker *time.Ticker
	address    string
	port       string
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
	address:    "127.0.0.1",
	port:       "35273",
}

var masterWS = websocketInstance{
	readChan:   make(chan []byte),
	writeChan:  make(chan []byte),
	pingTicker: time.NewTicker(pingPeriod),
	address:    "127.0.0.1",
	port:       "38477",
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
		log.Println("restarting websocket")
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

	//keep try to get a connection
	conn, err := net.Dial("tcp", wi.address+":"+wi.port)
	if err != nil {
		log.Println("Problem with creating connection " + err.Error())
		defer wi.init()
		time.Sleep(pingPeriod)
		return
	}

	site, err := url.Parse("ws://" + wi.address + ":" + wi.port)

	wi.socket, _, err = websocket.NewClient(conn, site, nil, bufferSize, bufferSize)

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
			log.Println("v ...interface{}")
		}
		return
	}

	go wi.writeHandler()
	wi.write("{\"flag\":\"identify\", \"name\":\"goserver\"}")
	go wi.readHandler()
}

func initWebsockets(waitGroup *sync.WaitGroup) {
	localWS.init()
	masterWS.init()

	waitGroup.Add(4)
}
