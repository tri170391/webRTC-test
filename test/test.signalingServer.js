require('should');
var sinon = require('sinon');
var signalingMessage = require('../app/server/signalingMessage');

describe('signalingServer', function() {

    var ws;
    
    describe('Initialization', function() {
        before(function() {
            ws = { 
                id: undefined,
            };
        });
        
        it('onInit', function() {
            signalingMessage.onInit(ws, 1);
            ws.id.should.be.equal(1);
            signalingMessage.connectedPeers[1].should.be.equal(ws);
        });
    });
    describe('Messages', function() {
        
        var spy;
        
        before(function() {
            ws = { 
                id: 1,
                send: function(){ return true; }
            };
        });
        beforeEach(function() {
            signalingMessage.connectedPeers[1] = ws;
            spy = sinon.spy(signalingMessage.connectedPeers[1], "send");
        });
        afterEach(function() {
            spy.restore();
        });
        
        it('onOffer', function() {
            signalingMessage.onOffer("offer", 1, 2);
            spy.calledOnce.should.be.true;
        });
        it('onAnswer', function() {
            signalingMessage.onAnswer("offer", 1, 2);
            spy.calledOnce.should.be.true;
        });
        it('onICECandidate', function() {
            signalingMessage.onICECandidate("offer", 1, 2);
            spy.calledOnce.should.be.true;
        });
    });
});