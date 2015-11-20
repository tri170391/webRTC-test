function initCaller(){
    var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
    var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    var RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;

    var wsUri = "ws://localhost:8090/";
    var signalingChannel = createSignalingChannel(wsUri);
    var servers = {iceServers: [{url: "stun:stun.1.google.com:19302"}]};
    
    function startCommunication(peerId) {
        var pc = new RTCPeerConnection(servers, {
            optional: [{
                DtlsSrtpKeyAgreement: true
            }]
        });
        
        signalingChannel.onAnswer = function (answer, source) {
            console.log('receive answer from ', source);
            pc.setRemoteDescription(new RTCSessionDescription(answer));
        };

        signalingChannel.onICECandidate = function (ICECandidate, source) {
            console.log("receiving ICE candidate from ",source);
            pc.addIceCandidate(new RTCIceCandidate(ICECandidate));
        };

        pc.onicecandidate = function (evt) {
            if(evt.candidate){ // empty candidate (wirth evt.candidate === null) are often generated
                signalingChannel.sendICECandidate(evt.candidate, peerId);
            }
        };

        pc.createOffer(function(offer){
            pc.setLocalDescription(offer);
            console.log('send offer');
            signalingChannel.sendOffer(offer, peerId);
        });

        var _commChannel = pc.createDataChannel('communication', {
            reliable: false
        });
        
        window.channel = _commChannel;
        
        _commChannel.onclose = function(evt) {
            console.log("dataChannel closed");
        };

        _commChannel.onerror = function(evt) {
            console.error("dataChannel error");
        };

        _commChannel.onopen = function(){
            console.log("dataChannel opened");
        };

        _commChannel.onmessage = function(message){
            console.log(message);
        };
    }
    
    window.startCommunication = startCommunication;
}