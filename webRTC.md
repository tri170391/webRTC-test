# WebRTC

## Purpose

WebRTC is an HTML5 API that allows direct communication between browsers, even if they are not directly reachable from the internet ([NAT](https://en.wikipedia.org/wiki/Network_address_translation), firewall, …). The RTCDataChannel of a webRTC connection can transfert binary data like Strings or Arraybuffer.

## How it works

To be initialized, a RTCPeerConnection needs two kinds of informations : session description and network informations.

### Session description

WebRTC uses the [Session Description Protocol](https://en.wikipedia.org/wiki/Session_Description_Protocol) to manage the connexions. Each peer must generate its session profile and send it to the other for the connexion to start.

A session profile looks like this:

```JavaScript
{ 
    type: 'answer',
    sdp: 'v=0\r\no=- 3394657852986083288 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:WwpUj8o7RWyMEZB9\r\na=ice-pwd:NZefqLvcKh/PyRZAIwImcksN\r\na=fingerprint:sha-256 E6:5A:91:A4:D8:01:DC:78:0A:0A:87:BE:FA:1E:1C:72:5C:F3:9C:3E:51:D2:8B:FA:D0:07:D0:E2:5D:6D:E3:E0\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n'
}
```

A peer must set its own session profile as `localDescription` of the RTCPeerConnection and the other's peer as `remoteDescription`.
The session profile are generated with the method `.createOffer` and `.createAnswer` of the RTCPeerConnection. (Note: both of these methods are asynchronous.)

### Network information: ICE candidates

To be able to establish a connection with anyone, including people behind NATs, WebRTC uses ICE which is a framework for connecting peers. Initially, ICE tries to connect peers directly, with the lowest possible latency, via UDP. In this process, STUN servers have a single task: to enable a peer behind a NAT to find out its public address and port. 

![Finding connection candidates](webRTC-images/stun.png)

If UDP fails, ICE tries TCP: first HTTP, then HTTPS. If direct connection fails—in particular, because of enterprise NAT traversal and firewalls—ICE uses an intermediary (relay) TURN server. In other words, ICE will first use STUN with UDP to directly connect peers and, if that fails, will fall back to a TURN relay server. The expression 'finding candidates' refers to the process of finding network interfaces and ports.

A candidate looks like this : 
```JavaScript
{ 
    candidate: 'candidate:2057852828 1 udp 2122260223 192.168.2.154 37576 typ host generation 0',
    sdpMid: 'data',
    sdpMLineIndex: 0 
}
```

The candidate are automatically gathered when the initalization of RTCPeerConnection is done (more info about the initalization process below) and each gathered ICE candidate will trigger a `icecandidate` event on the RTCPeerConnection. 

Every gathered ICECandidate must be transfered to the other peer for the connexion to start.

### Signaling

To establish a connexion between two peers, they need to send each-other their ICE candidate and their session profile. This processus is called signaling, and require a duplex communication channel between the two peers. The most obvious way to realize the signaling, is to connect both peers to the same signaling server via WebSocket and send their signaling infos through the server.

### Connection establishment

The establishement of the connection can be separated in 2 parts:
- the initialization of the RTCPeerConnection object
- the signaling
 
#### Initialization of the RTCPeerConnection object

- create RTCPeerConnection : `new RTCPeerConnection(servers, options);`
- create DataChannel : `_commChannel = peerConnection.createDataChannel(label, options)` (this step is for the caller only)
- createOffer : `peerConnection.createOffer(callback)`
- (in the callback of createOffer) add the local description to the peer connection : `peerConnection.setLocalDescription(offer);`
This last step finishes the initalization process and start ICE candidate gathering.

#### Signaling 
- send the session description offer to the other peer
- gather ICE candidates and send them to the other peer
- receive the session description answer from the other peer and add it as a remote description to the RTCPeerConnection: `peerConnection.setRemoteDescription(new RTCSessionDescription(answer));`
When the ICEcandidate and the session descriptions has been received by both peers, the connection is established.

### Additionnal steps for the DataChannel:
- for the peer that initiated the connection (the caller), the DataChannel object will trigger a `open` event.
- for the passive peer (the callee), once the connection is set up, the RTCPeerConnection will trigger an event `datachannel` that contains the active datachannel. 

## Example

An example of working webRTC application is available in this repository. See [EXAMPLE.md](EXAMPLE.md) for more details.