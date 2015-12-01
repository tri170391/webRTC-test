var WebSocketServer = require('ws').Server;
var signalingMessage = require('./signalingMessage');
var PORT_NUMBER = 8090; 
var wss = new WebSocketServer({ port: PORT_NUMBER });

wss.on('connection', function connection(ws) {
    console.log('connection from a client');
    ws.on('message', function incoming(message) {
        signalingMessage.onMessage(ws, message);
    });
});

console.log("started signaling server on port" + PORT_NUMBER);