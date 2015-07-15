// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
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

type websocketParams struct {
	socket *websocket.Conn
	read   chan []byte
	write  chan []byte
}

var ws = websocketParams{
	read:  make(chan []byte),
	write: make(chan []byte),
}

var (
	addr     = flag.String("addr", ":8080", "http service address")
	filename string
)
var bufferSize = 1024

func readBlocking() string {
	raw := <-ws.read
	s := string(raw[:len(raw)])

	return s
}

func readBytesBlocking() []byte {
	raw := <-ws.read
	return raw
}

func readHandler() {
	ws.socket.SetReadLimit(512)
	ws.socket.SetReadDeadline(time.Now().Add(pongWait))
	ws.socket.SetPongHandler(func(string) error { ws.socket.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := ws.socket.ReadMessage()
		if err != nil {
			break
		}
		ws.read <- message
	}
}

func write(message []byte) {
	ws.write <- message
}

func writeHandler() {
	pingTicker := time.NewTicker(pingPeriod)
	defer func() {
		pingTicker.Stop()
		ws.socket.Close()
	}()

	for {
		select {
		case <-pingTicker.C:
			ws.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.socket.WriteMessage(websocket.PingMessage, []byte{}); err != nil {

				log.Fatal(err)
			}
		case message := <-ws.write:
			ws.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.socket.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Fatal(err)
			}
		}
	}
}

func initWebsockets() {
	conn, err := net.Dial("tcp", "127.0.0.1:38477")
	if err != nil {
		log.Println("Problem with creating connection " + err.Error())
		return
	}
	site, err := url.Parse("ws://127.0.0.1:38477/")

	socket, _, err := websocket.NewClient(conn, site, nil, bufferSize, bufferSize)
	ws.socket = socket

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
			log.Println("v ...interface{}")
		}
		return
	}

	waitGroup := new(sync.WaitGroup)
	waitGroup.Add(2)
	go writeHandler()
	write([]byte("{\"flag\":\"identify\", \"name\":\"goserver\"}"))
	go readHandler()
	waitGroup.Wait()
}
