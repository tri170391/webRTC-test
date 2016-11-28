# Signaling server protocol
## Client first time connection:
* Client connects -> ask to "join" server.
* Server response by generating a unique user id =? "welcome" with ID response back to client.
* Client set ID -> "thanks" server for confirmation.
* Server notify connected clients about the new clinet. -> Send "newclient" message.
* Currently connected clients initiate WebRTC connect procedure on new client.
## User disconnect:
* On Server: Disconnect event from client socket. -> Server remove current client from user list.
* On Client: WebRTC connection closed. -> Remove connection from list of current connections.
## User ask to open P2P connection to another user:
* User send his WebRTC offer and target userID.
* Server relay offer to appropriate user or error if userID is not connected.
* Target user send answer WebRTC response to server with request userID.
* Server relay answer to request user.