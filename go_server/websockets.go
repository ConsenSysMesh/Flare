// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"log"
	"net"
	"net/http"
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
}

var ws = websocketParams{}

var (
	addr     = flag.String("addr", ":8080", "http service address")
	filename string
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

func reader() {
	defer ws.socket.Close()
	ws.socket.SetReadLimit(512)
	ws.socket.SetReadDeadline(time.Now().Add(pongWait))
	ws.socket.SetPongHandler(func(string) error { ws.socket.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, _, err := ws.socket.ReadMessage()
		if err != nil {
			break
		}
	}
}

func writer(message []byte) {
	ws.socket.SetWriteDeadline(time.Now().Add(writeWait))
	if err := ws.socket.WriteMessage(websocket.TextMessage, message); err != nil {
		log.Fatal(err)
	}
}

func pingWriter() {
	pingTicker := time.NewTicker(pingPeriod)

	defer func() {
		pingTicker.Stop()
		ws.socket.Close()
	}()
	go func() {
		for {
			select {
			case <-pingTicker.C:
				ws.socket.SetWriteDeadline(time.Now().Add(writeWait))
				if err := ws.socket.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
					log.Fatal(err)
				}
			}
		}
	}()
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	conn, err := net.Dial("tcp", "localhost:38477")
	socket, err := websocket.NewClient(conn, "/", nil)
	ws.socket = socket

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
		}
		return
	}

	log.Println("adad")
	pingWriter()
	reader()
}

func initWebsockets() {
	http.HandleFunc("/", serveWs)
	if err := http.ListenAndServe(*addr, nil); err != nil {
		log.Fatal(err)
	}
}
