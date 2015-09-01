package main

import (
	"log"
	"net"
	"net/http"
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
	pingPeriod = 3 * time.Second
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type websocketInstance struct {
	socket     *websocket.Conn
	readChan   chan []byte
	writeChan  chan []byte
	pingTicker *time.Ticker
	address    string
	port       string
	path       string
	isClient   bool
}

type websocketInterface interface {
	readBlocking() string
	readBytesBlocking() []byte
	readHandler()
	write(message string)
	writeBytes(message []byte)
	writeHandler()
	serve()
	connect()
}

var localWSServer = websocketInstance{
	readChan:   make(chan []byte, 5),
	writeChan:  make(chan []byte, 5),
	pingTicker: time.NewTicker(pingPeriod),
	path:       "/local",
	isClient:   false,
}

var masterWSClient = websocketInstance{
	readChan:   make(chan []byte, 5),
	writeChan:  make(chan []byte, 5),
	pingTicker: time.NewTicker(pingPeriod),
	path:       "/master",
	isClient:   true,
}

var bufferSize = 1024
var runningWebsockets = false

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
	//wi.socket.SetReadLimit(512)
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

	if runningWebsockets {
		defer func() {
			wi.socket.Close()
			if wi.isClient {
				wi.connect()
			}
		}()
	}

	for {
		select {
		case <-wi.pingTicker.C:
			wi.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := wi.socket.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				if runningWebsockets {
					log.Println(err)
				}
				return
			}
		case message := <-wi.writeChan:
			wi.socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := wi.socket.WriteMessage(websocket.TextMessage, message); err != nil {
				if runningWebsockets {
					log.Println(err)
				}
				return
			}
		}
	}
}

func (wi *websocketInstance) serve(w http.ResponseWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)
	wi.socket = socket
	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
		}
		return
	}

	log.Println(r.Referer())
	go wi.writeHandler()
	go wi.readHandler()
}

func (wi *websocketInstance) connect() {
	//keep trying to get a connection

	var conn net.Conn
	var dialConnection func()
	dialConnection = func() {
		_conn, err := net.Dial("tcp", wi.address+":"+wi.port)
		if err != nil {
			defer dialConnection()
			time.Sleep(pingPeriod)
			return
		}
		conn = _conn
	}
	dialConnection()

	log.Println("connection found")

	site, err := url.Parse("ws://" + wi.address + ":" + wi.port + wi.path)

	wi.socket, _, err = websocket.NewClient(conn, site, nil, bufferSize, bufferSize)

	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
		}
		return
	}

	go wi.writeHandler()
	go wi.readHandler()
}

func startWebsockets() {
	runningWebsockets = true

	localWSServer.address = config.Flare.Local.IP
	localWSServer.port = config.Flare.Local.Port

	http.HandleFunc(localWSServer.path, localWSServer.serve)
	go func() {
		if err := http.ListenAndServe(localWSServer.address+":"+localWSServer.port, nil); err != nil {
			log.Fatal(err)
		}
	}()

	masterWSClient.address = config.Flare.Master.IP
	masterWSClient.port = config.Flare.Master.Port

	log.Println("waiting for connection to ethereum standalone...")
	masterWSClient.connect()
}

func stopWebsockets() {
	runningWebsockets = false
}
