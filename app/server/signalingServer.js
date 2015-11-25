var WebSocketServer = require('ws').Server;
var PORT_NUMBER = 8090; 
var wss = new WebSocketServer({ port: PORT_NUMBER });

var connectedPeers = {};

wss.on('connection', function connection(ws) {
    console.log('connection from a client');
    ws.on('message', function incoming(message) {
        onMessage(ws, message);
    });
});

console.log("started signaling server on port" + PORT_NUMBER);

function onMessage(ws, message){
    var objMessage = JSON.parse(message);
    var type = objMessage.type;
    switch (type) {
        case "ICECandidate":
            onICECandidate(objMessage.ICECandidate, objMessage.destination, ws.id);
            break;
        case "offer":
            onOffer(objMessage.offer, objMessage.destination, ws.id);
            break;
        case "answer":
            onAnswer(objMessage.answer, objMessage.destination, ws.id);
            break;
        case "init":
            onInit(ws, objMessage.init);
            break;
        default:
            throw new Error("invalid message type");
    }
}

function onInit(ws, id){
    console.log("init from peer:", id);
    ws.id = id;
    connectedPeers[id] = ws;
}

function onOffer(offer, destination, source){
    console.log("offer from peer:", source, "to peer", destination);
    connectedPeers[destination].send(JSON.stringify({
        type:'offer',
        offer:offer,
        source:source,
    }));
}

function onAnswer(answer, destination, source){
    console.log("answer from peer:", source, "to peer", destination);
    connectedPeers[destination].send(JSON.stringify({
        type: 'answer',
        answer: answer,
        source: source,
    }));
}

function onICECandidate(ICECandidate, destination, source){
    console.log("ICECandidate from peer:", source, "to peer", destination);
    connectedPeers[destination].send(JSON.stringify({
        type: 'ICECandidate',
        ICECandidate: ICECandidate,
        source: source,
    }));
}
