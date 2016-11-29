# P2P Messaging Client Behaviors

## On load:

* Open WebSocket connection to signaling server.
* On receiving "welcome" with id, show the assigned user ID to user.
* Requesting current clients list, on receiving the list. Try to connect to each user ID.
* Add sucessfully connected users and their corresponding RTCPeerConnection to the userlist.
* Update UI.

## On receiving a connection offer:

* Answer the offer and establish the connection to the offering client.
* Add the client to the userlist if connection is sucessfully established.
* Update UI.

## On receiving a disconnection notification from signaling server:

* Try to close the corresponding RTCPeerConnection.
* Remove the client from the userlist.
* Update UI.

## On sending message from user input:

* Send a message through RTCPeerConnection of selected user on usertlist.
* Append "Me: <message>" to messaging textbox.

## On receiving message from user input:

* Append "userid: <message>" to messaging textbox.