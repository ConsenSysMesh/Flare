// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
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

var (
	addr     = flag.String("addr", ":8080", "http service address")
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	trackChanges bool
)

func readFileIfModified(lastMod time.Time) ([]byte, time.Time, error) {
	fi, err := os.Stat(filename)
	if err != nil {
		return nil, lastMod, err
	}
	if !fi.ModTime().After(lastMod) {
		return nil, lastMod, nil
	}
	text, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, fi.ModTime(), err
	}
	return text, fi.ModTime(), nil
}

func getFile(string filename, lastMod time.Time) {
	lastError := ""
	fileTicker := time.NewTicker(filePeriod)
	defer func() {
		fileTicker.Stop()
		ws.Close()
	}()
	select {
	case <-fileTicker.C:
		var p []byte
		var err error

		text, lastMod, err = readFileIfModified(lastMod)

		if err != nil {
			if s := err.Error(); s != lastError {
				lastError = s
				text = []byte(lastError)
			}
		} else {
			lastError = ""
		}

		if text != nil {
			ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.WriteMessage(websocket.TextMessage, p); err != nil {
				return
			}
		}
	}
}

func serveWs(w http.ResponseWriter, r *http.Request) {

	var lastMod time.Time
	if n, err := strconv.ParseInt(r.FormValue("lastMod"), 16, 64); err != nil {
		lastMod = time.Unix(0, n)
	}

	go writer(lastMod)
}

func getSparkLog(file string) {
	var filename = file

	http.HandleFunc("/ws", serveWs)
	if err := http.ListenAndServe(*addr, nil); err != nil {
		log.Fatal(err)
	}
}
