package com.consensys.flare

import java.net.{URI, InetSocketAddress, UnknownHostException}

import org.java_websocket.drafts.{Draft_10, Draft_17}
import org.java_websocket.{WebSocketImpl, WebSocket}
import org.java_websocket.client.WebSocketClient
import org.java_websocket.handshake.{ServerHandshake, ClientHandshake}
import org.java_websocket.server.WebSocketServer

import scala.collection.JavaConversions._

/** A simple WebSocketServer implementation. Keeps track of a "chatroom".
  */
@throws(classOf[UnknownHostException])
class EthConnectClient(location: URI) extends WebSocketClient(location, new Draft_17) {

  def onOpen(handshake: ServerHandshake) {
    System.out.println( " entered the room!" );
  }

  def onClose(code: Int, reason: String, remote: Boolean) {
    System.out.println(reason +" made leave with code "+code );
  }

  def onMessage(message: String) {
    System.out.println(": " + message );
  }

  def onError(ex: Exception) {
    ex.printStackTrace();
  }
}

object EthConnectClient {
  def apply(location: URI) = new EthConnectClient(location)

  def apply(location: String) = new EthConnectClient(new URI(location))

  def main(args: Array[String]) {
    WebSocketImpl.DEBUG = true
    val location = "ws://localhost:38477"
    println("Default server url not specified: defaulting to \'" + location + "\'")
    val ws = apply(location)

    ws.connectBlocking()
    ws.send("Hello World")
    //ws.close
  }
}