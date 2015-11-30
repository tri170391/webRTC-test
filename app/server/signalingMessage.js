var signalingMessage = {
    connectedPeers: {},
    
    onMessage: function(ws, message){
        var objMessage = JSON.parse(message);
        var type = objMessage.type;
        switch (type) {
            case "ICECandidate":
                signalingMessage.onICECandidate(objMessage.ICECandidate, objMessage.destination, ws.id);
                break;
            case "offer":
                signalingMessage.onOffer(objMessage.offer, objMessage.destination, ws.id);
                break;
            case "answer":
                signalingMessage.onAnswer(objMessage.answer, objMessage.destination, ws.id);
                break;
            case "init":
                signalingMessage.onInit(ws, objMessage.init);
                break;
            default:
                throw new Error("invalid message type");
        }
    },

    onInit: function(ws, id){
        console.log("init from peer:", id);
        ws.id = id;
        signalingMessage.connectedPeers[id] = ws;
    },

    onOffer: function(offer, destination, source){
        console.log("offer from peer:", source, "to peer", destination);
        signalingMessage.connectedPeers[destination].send(JSON.stringify({
            type:'offer',
            offer:offer,
            source:source,
        }));
    },

    onAnswer: function(answer, destination, source){
        console.log("answer from peer:", source, "to peer", destination);
        signalingMessage.connectedPeers[destination].send(JSON.stringify({
            type: 'answer',
            answer: answer,
            source: source,
        }));
    },

    onICECandidate: function(ICECandidate, destination, source){
        console.log("ICECandidate from peer:", source, "to peer", destination);
        signalingMessage.connectedPeers[destination].send(JSON.stringify({
            type: 'ICECandidate',
            ICECandidate: ICECandidate,
            source: source,
        }));
    }
};

module.exports = signalingMessage;
