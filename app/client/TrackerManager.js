function TrackerManager(){

    var _ws;
    
    function connectToTracker(url){
        _ws = new WebSocket(wsUri);
        _ws.onopen = _onConnectionEstablished;
        _ws.onclose = _onClose;
        _ws.onmessage = _onMessage;
        _ws.onerror = _onError;
    }
    
    function _onConnectionEstablished(){
        _sendMessage('init');
    }

    function _onClose(){
        console.error("connection closed");
    }

    function _onError(err){
        console.error("error:", err);
    }


    function _onMessage(evt){
        var objMessage = JSON.parse(evt.data);
        switch (objMessage.type) {
            case "ICECandidate":
                _onICECandidate(objMessage.ICECandidate, objMessage.source);
                break;
            case "offer":
                _onOffer(objMessage.offer, objMessage.source);
                break;
            case "answer":
                _onAnswer(objMessage.answer, objMessage.source);
                break;
            default:
                throw new Error("invalid message type");
        }
    }

    function _sendMessage(type, data, destination){
        var message = {};
        message.type = type;
        message[type] = data;
        message.destination = destination;
        _ws.send(JSON.stringify(message));
    }
    
    function _onOffer(offer, source){
        console.log("offer from peer:", source, ':', offer);
    }

    function _onAnswer(answer, source){
        console.log("answer from peer:", source, ':', answer);
    }

    function _onICECandidate(ICECandidate, source){
        console.log("ICECandidate from peer:", source, ':', ICECandidate);
    }

    function sendICECandidate(ICECandidate, destination){
        _sendMessage("ICECandidate", ICECandidate, destination);
    }

    function sendOffer(offer, destination){
        _sendMessage("offer", offer, destination);
    }

    function sendAnswer(answer, destination){
        _sendMessage("answer", answer, destination);
        
    }

    this.connectToTracker = connectToTracker;
    this.sendICECandidate = sendICECandidate;
    this.sendOffer = sendOffer;
    this.sendAnswer = sendAnswer;
}
