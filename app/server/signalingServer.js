var PORT = 80
var io = require('socket.io')(PORT);

console.log('Started signaling server on port ' + PORT)

// User connected
io.on('connection', function(socket) {
	console.log("Client " + socket.id + " connected.")	
	
	// User sent a message
	socket.on('message', function() {});
	
	// User disconnected
	socket.on('disconnect', function() {console.log("Client " + socket.id + " disconnected.")});
});