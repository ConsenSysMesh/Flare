package com.consensys.flare

import java.io.{BufferedReader, IOException, InputStreamReader}

import org.java_websocket.WebSocketImpl

import scala.util.control.Breaks._
/**
 * Created by firescar96 on 7/7/15.
 */
object FlareSpark {

  @throws(classOf[InterruptedException])
  @throws(classOf[IOException])
  def main(args: Array[String]) {
    WebSocketImpl.DEBUG = true;
    var port = 38477; // 843 flash policy port
    try {
      port = Integer.parseInt(args(0));
    } catch {
      case ex: Exception =>
    }
    val s = new EthConnectServer( port );
    s.start();
    System.out.println( "ChatServer started on port: " + s.getPort() );

    val sysin = new BufferedReader( new InputStreamReader( System.in ) );
    while (true) {
      val in = sysin.readLine();
      s.sendToAll( in );
      if( in.equals( "exit" ) ) {
        s.stop();
        break;
      }
      else if( in.equals( "restart" ) ) {
        s.stop();
        s.start();
        break;
      }
    }
  }
}
