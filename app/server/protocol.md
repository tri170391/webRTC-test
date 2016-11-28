# Signaling server protocol

## Client first time connection:

* Client connects.
* Server response by generating a unique user id -> "welcome" with ID response back to client.

## Client request the list of connected users and connect to his peers:

* Client send a "getusers" request.
* Server responds with the "userlist" of currently connected user IDs.
* Client initiate WebRTC connection procedure with each of the peers.
* When WebRTC connection is established, client say "hello" to his peer with his ID.

## User disconnect:

* On Server: Disconnect event from client socket. -> Server remove current client from user list.
* Server send a "clientdisconnected" to the rest of the users.

## User ask to open P2P connection to another user:

* User send his WebRTC "offer" and target userID.
* Server relay "offer" to appropriate user or "error" back to requesting user if userID is not connected.
* Target user send "answer" WebRTC response to server with requesting userID.
* Server relay "answer" to request user.
* Server relay apprproiate "icecandidate" to each user.