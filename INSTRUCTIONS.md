#Instructions

## Requirements:
The amount of lines of code required by this test is small, although there might be interesting edge-cases to deal with.
The quality must be your main concern when answering this test : the code **must** be **production-ready**.

## Questions:

### 1. Create a peer to peer application that allows several peers to send message to each other: 
- There should be a single page (no separation between caller & callee)
- once on the page, they must see the list of all other peers connected
- a peer connection must be established with every other peers immediately after the connection to the page. 
- they must be able to send message to any other connected peers directly. (unicast message, broadcast not needed)

What are the problem of this architecture ?

### 2. New architecture: instead of realizing the WebRTC signaling using the signaling server, we will now use an hybrid approach:
- each time a peer connects to the page, the signaling server only gives him 1 peer to connect to. (the peer is chosen at random)
- once he's connected to this peer, he ask the complete  list of peers.
- then he connects to every peers using the first peer as a signaling channel.

How many peer connection can be opened on a single computer ?
