var PORT = process.env.PORT || 80;
var io = require('socket.io')(PORT);

console.log('Started signaling server on port ' + PORT);

var userlist = {};

// User connected.
io.on('connection', function(socket) {
	console.log("Client " + socket.id + " connected.");
	
	// Send to user his UserID
	socket.emit("welcome", {id: socket.id});
	
	// Keep reference to this user's socket for later uses.
	userlist[socket.id] = {conn:socket};
	
	// User ask for current list of users.
	socket.on('ask_user_list', function() {
		console.log("Client " + socket.id + " asked for current list of users.");
		socket.emit('answer_user_list', {list: Object.keys(userlist)});
	});
	
	// Send an offer to another user
	socket.on("rtc_offer", function(offer) {
		console.log("Client " + socket.id + " made an offer to " + offer.to + ".");
		if (offer.to in userlist) {
			userlist[offer.to].conn.emit('rtc_offer', {sender: socket.id, sdp: offer.sdp});
		}
		else {
			socket.emit('protocol_error', {msg: "UserID not connected."})
		}
	});
	
	// Send an answer to another user
	socket.on("rtc_answer", function(answer) {
		console.log("Client " + socket.id + " answers " + answer.to + ".");
		if (answer.to in userlist) {
			userlist[answer.to].conn.emit('rtc_answer', {sender: socket.id, sdp: answer.sdp});
		}
		else {
			socket.emit('protocol_error', {msg: "UserID not connected."})
		}
	});
	
	// Send an ice_candidate to another user
	socket.on("rtc_ice_candidate", function(ice_candidate) {
		console.log("Client " + socket.id + " sends ICE candidates to " + ice_candidate.to + ".");
		if (ice_candidate.to in userlist) {
			userlist[ice_candidate.to].conn.emit('rtc_ice_candidate', {sender: socket.id, ice: ice_candidate.ice});
		}
		else {
			socket.emit('protocol_error', {msg: "UserID not connected."})
		}
	});
	
	// User disconnected.
	socket.on('disconnect', function() {
		console.log("Client " + socket.id + " disconnected.");
		delete userlist[socket.id];
		
		// Notify everyone left that the user has been disconnected.
		socket.broadcast.emit("client_disconnected", {who: socket.id});
	});
});