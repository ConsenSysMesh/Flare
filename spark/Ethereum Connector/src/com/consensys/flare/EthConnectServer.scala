package com.consensys.flare

import java.net.{InetSocketAddress, UnknownHostException}

import org.java_websocket.WebSocket
import org.java_websocket.handshake.ClientHandshake
import org.java_websocket.server.WebSocketServer

import scala.collection.JavaConversions._

/** A simple WebSocketServer implementation. Keeps track of a "chatroom".
 */
@throws(classOf[UnknownHostException])
class EthConnectServer(address: InetSocketAddress) extends WebSocketServer(address) {

  def this(port: Int) = this(new InetSocketAddress(port))

  override  def onOpen(conn: WebSocket, handshake: ClientHandshake) {
    this.sendToAll( "new connection: " + handshake.getResourceDescriptor() );
    System.out.println( conn.getRemoteSocketAddress().getAddress().getHostAddress() + " entered the room!" );
  }

  override def onClose(conn: WebSocket, code: Int, reason: String, remote: Boolean) {
    this.sendToAll( conn + " has left the room!" );
    System.out.println( conn + " has left the room!" );
  }

  override def onMessage(conn: WebSocket, message: String) {
    this.sendToAll( message );
    System.out.println( conn + ": " + message );
  }

  override def onError(conn: WebSocket, ex: Exception) {
    ex.printStackTrace();
    if( conn != null ) {
      // some errors like port binding failed may not be assignable to a specific websocket
    }
  }

  /**
   * Sends <var>text</var> to all currently connected WebSocket clients.
   * @param text The String to send across the network.
   * @throws InterruptedException When socket related I/O errors occur.
   */
  def sendToAll(text: String) {
    val con = connections()
    for (c <- con) {
      c.synchronized {
        c.send(text)
      }
    }
  }

}

object EthConnectServer {
  def apply(address: InetSocketAddress) = new EthConnectServer(address)

  def apply(port: Int) = new EthConnectServer(port)
}