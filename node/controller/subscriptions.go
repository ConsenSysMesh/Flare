/*Programs connected over websockets will receives the following published values when the values change*/
package main

import "github.com/eapache/channels"

type publishments struct {
	config                []byte
	configChan            *channels.RingChannel
	cassandraNodeInfo     map[string]interface{}
	cassandraNodeInfoChan *channels.RingChannel
	cassandraNodeRing     []map[string]interface{}
	cassandraNodeRingChan *channels.RingChannel
}

var publish = publishments{
	configChan:            channels.NewRingChannel(1),
	cassandraNodeInfoChan: channels.NewRingChannel(1),
	cassandraNodeRingChan: channels.NewRingChannel(1),
}
