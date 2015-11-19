# WebRTC

Note: This article is widely inspired of the [amazing HTML5Rocks article about WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-signaling). Only the RTCDataChannel (which is the core of this test) will be discussed in the following.


## RTCDataChannel

WebRTC supports real-time communication for any types of data.

The RTCDataChannel API enables peer-to-peer exchange of arbitrary data, with low latency and high throughput. There's a simple 'single page' demo at http://webrtc.github.io/samples/src/content/datachannel/datatransfer.
The syntax is deliberately similar to WebSocket, with a send() method and a message event:

```JavaScript
var pc = new RTCPeerConnection(servers,
  {optional: [{RtpDataChannels: true}]});

pc.ondatachannel = function(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function(event){
    document.querySelector("div#receive").innerHTML = event.data;
  };
};

sendChannel = pc.createDataChannel("sendDataChannel", {reliable: false});

document.querySelector("button#send").onclick = function (){
  var data = document.querySelector("textarea#send").value;
  sendChannel.send(data);
};
```

## Signaling: session control, network and media information

WebRTC uses RTCPeerConnection to communicate streaming data between browsers (aka peers), but also needs a mechanism to coordinate communication and to send control messages, a process known as signaling. Signaling methods and protocols are not specified by WebRTC: signaling is not part of the RTCPeerConnection API. In this test, a template of signaling system has been provided, using web sockets for client-server communication.

Signaling is used to exchange three types of information:

- Session control messages: to initialize or close communication and report errors
- Network configuration: to the outside world, what's my computer's IP address and port

The exchange of information via signaling must have completed successfully before peer-to-peer streaming can begin.

For example, imagine Alice wants to communicate with Bob. Here's a code sample from the WebRTC W3C Working Draft, which shows the signaling process in action. The code assumes the existence of some signaling mechanism, created in the createSignalingChannel() method. Also note that on Chrome and Opera, RTCPeerConnection is currently prefixed.

```JavaScript
var url = ...;
var signalingChannel = createSignalingChannel(url);
var pc;

// run start(true, <id of the peer you want to communicate with>) to initiate a call
function start(isCaller, peerId) {
    pc = new RTCPeerConnection(servers,
      {optional: [{RtpDataChannels: true}]});

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        signalingChannel.sendICECandidate(evt.candidate, peerId);
    };

    sendChannel = pc.createDataChannel("sendDataChannel", {reliable: true});

    if (isCaller){
        pc.createOffer(function(offer){
            pc.setLocalDescription(offer);
            signalingChannel.sendOffer(offer, peerId);
        });
    }
}

signalingChannel.onOffer = function (offer, source) {
    start(false, source);
    pc.setRemoteDescription(new RTCSessionDescription(offer));
    pc.createAnswer(pc.remoteDescription, function(answer){
        pc.setLocalDescription(answer);
        signalingChannel.sendAnswer(answer, peerId);
    });
};

signalingChannel.onAnswer = function (answer, source) {
    pc.setRemoteDescription(new RTCSessionDescription(answer));
};

signalingChannel.onICECandidate = function (ICECandidate, source) {
    pc.addIceCandidate(new RTCIceCandidate(ICECandidate));
};
```

First up, Alice and Bob exchange network information. (The expression 'finding candidates' refers to the process of finding network interfaces and ports using the ICE framework.)

- Alice creates an RTCPeerConnection object with an onicecandidate handler
- The handler is run when network candidates become available
- Alice sends candidate data to Bob, via whatever signaling channel they are using: WebSocket or some other mechanism
- When Bob gets a candidate message from Alice, he calls addIceCandidate, to add the candidate to the remote peer description.

For video chats, WebRTC clients (known as peers, aka Alice and Bob) also need to ascertain and exchange local and remote audio and video media information, such as resolution and codec capabilities. Signaling to exchange media configuration information proceeds by exchanging an offer and an answer using the Session Description Protocol (SDP):

- Alice runs the RTCPeerConnection createOffer() method. The callback argument of this is passed an RTCSessionDescription: Alice's local session description
- In the callback, Alice sets the local description using setLocalDescription() and then sends this session description to Bob via their signaling channel. Note that RTCPeerConnection won't start gathering candidates until setLocalDescription() is called: this is codified in JSEP IETF draft
- Bob sets the description Alice sent him as the remote description using setRemoteDescription
- Bob runs the RTCPeerConnection createAnswer() method, passing it the remote description he got from Alice, so a local session can be generated that is compatible with hers. The createAnswer() callback is passed an RTCSessionDescription: Bob sets that as the local description and sends it to Alice
- When Alice gets Bob's session description, she sets that as the remote description with setRemoteDescription.
    Ping!

RTCSessionDescription objects are blobs that conform to the Session Description Protocol, SDP. Serialized, an SDP object looks like this:

```
v=0
o=- 3883943731 1 IN IP4 127.0.0.1
s=
t=0 0
a=group:BUNDLE audio video
m=audio 1 RTP/SAVPF 103 104 0 8 106 105 13 126

// ...

a=ssrc:2223794119 label:H4fjnMzxy3dPIgQ7HxuCTLb4wLLLeRHnFxh810
```

The acquisition and exchange of network and media information can be done simultaneously, but both processes must have completed before audio and video streaming between peers can begin.

The offer/answer architecture described above is called JSEP, JavaScript Session Establishment Protocol. (There's an excellent animation explaining the process of signaling and streaming in Ericsson's demo video for its first WebRTC implementation.)

![JSEP architecture diagram](webRTC-images/jsep.png)


Once the signaling process has completed successfully, data can be streamed directly peer to peer, between the caller and callee—or if that fails, via an intermediary relay server (more about that below). Streaming is the job of RTCPeerConnection.
RTCPeerConnection

RTCPeerConnection is the WebRTC component that handles stable and efficient communication of streaming data between peers.

Below is a WebRTC architecture diagram showing the role of RTCPeerConnection. As you will notice, the green parts are complex!

![WebRTC architecture (from webrtc.org)](webRTC-images/webrtcArchitecture.png)

From a JavaScript perspective, the main thing to understand from this diagram is that RTCPeerConnection shields web developers from the myriad complexities that lurk beneath. The codecs and protocols used by WebRTC do a huge amount of work to make real-time communication possible, even over unreliable networks:

- packet loss concealment
- echo cancellation
- bandwidth adaptivity
- dynamic jitter buffering
- automatic gain control
- noise reduction and suppression
- image 'cleaning'.

The W3C code above shows a simplified example of WebRTC from a signaling perspective. Below are walkthroughs of two working WebRTC applications: the first is a simple example to demonstrate RTCPeerConnection; the second is a fully operational video chat client.
RTCPeerConnection without servers

The code below is taken from the 'single page' WebRTC demo at https://webrtc.github.io/samples/src/content/peerconnection/pc1, which has local and remote RTCPeerConnection (and local and remote video) on one web page. This doesn't constitute anything very useful—caller and callee are on the same page—but it does make the workings of the RTCPeerConnection API a little clearer, since the RTCPeerConnection objects on the page can exchange data and messages directly without having to use intermediary signaling mechanisms.


In this example, pc1 represents the local peer (caller) and pc2 represents the remote peer (callee).

### Caller

Create a new RTCPeerConnection and add the stream from getUserMedia():

```JavaScript
// servers is an optional config file (see TURN and STUN discussion below)
pc1 = new webkitRTCPeerConnection(servers);
// ...
pc1.addStream(localStream); 
```

Create an offer and set it as the local description for pc1 and as the remote description for pc2. This can be done directly in the code without using signaling, because both caller and callee are on the same page:
    
```JavaScript
pc1.createOffer(gotDescription1);
//...
function gotDescription1(desc){
  pc1.setLocalDescription(desc);
  trace("Offer from pc1 \n" + desc.sdp);
  pc2.setRemoteDescription(desc);
  pc2.createAnswer(gotDescription2);
}
```

### Callee

Create pc2 and, when the stream from pc1 is added, display it in a video element:
```JavaScript
pc2 = new webkitRTCPeerConnection(servers);
pc2.onaddstream = gotRemoteStream;
//...
function gotRemoteStream(e){
  vid2.src = URL.createObjectURL(e.stream);
}
```

RTCPeerConnection plus servers

In the real world, WebRTC needs servers, however simple, so the following can happen:

- Users discover each other and exchange 'real world' details such as names.
- WebRTC client applications (peers) exchange network information.
- Peers exchange data about media such as video format and resolution.
- WebRTC client applications traverse NAT gateways and firewalls.

In other words, WebRTC needs four types of server-side functionality:

- User discovery and communication.
- Signaling.
- NAT/firewall traversal.
- Relay servers in case peer-to-peer communication fails.

NAT traversal, peer-to-peer networking, and the requirements for building a server app for user discovery and signaling, are beyond the scope of this article. Suffice to say that the STUN protocol and its extension TURN are used by the ICE framework to enable RTCPeerConnection to cope with NAT traversal and other network vagaries.

ICE is a framework for connecting peers, such as two video chat clients. Initially, ICE tries to connect peers directly, with the lowest possible latency, via UDP. In this process, STUN servers have a single task: to enable a peer behind a NAT to find out its public address and port. (Google has a couple of STUN severs, one of which is used in the apprtc.appspot.com example.)

![Finding connection candidates](webRTC-images/stun.png)


If UDP fails, ICE tries TCP: first HTTP, then HTTPS. If direct connection fails—in particular, because of enterprise NAT traversal and firewalls—ICE uses an intermediary (relay) TURN server. In other words, ICE will first use STUN with UDP to directly connect peers and, if that fails, will fall back to a TURN relay server. The expression 'finding candidates' refers to the process of finding network interfaces and ports.

![WebRTC data pathways](webRTC-images/dataPathways.png)