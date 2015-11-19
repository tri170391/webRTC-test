# Application test:

## Introduction:

The goal of this test is to create a peer to peer application the send binary data from on browser tab to another, using the RTCDataChannel of the WebRTC HTML5 API.
Web RTC is an API this allows direct client-to-client communication. It's widely used for video chats in the browser, but it can be used for many things, including peer-to-peer video delivery like we do at Streamroot. 

## Questions:

## How to use this repository:

### Prerequisites:
- nodejs v4.2+
- modern browser : Mozilla Firefox 44+ (Developer Edition or Nightly), or Google Chrome. You can use an older version of Firefox but in this case notice that WebRTC API will be prefixed (mozRTCPeerConnection, mozRTCSessionDescription and mozRTCIceCandidate).

### Unit tests:
The unit tests can be found in the `test/` directory.
#### run tests:
`npm test`

#### tools:
- mocha
- sinonjs
- shouldjs

### Launching the app:
Run `npm start` (it starts the signaling server on port 8090 and start a web server on the root of this repository on port 8089) then go to [http://localhost:8089/app/client](http://localhost:8089/app/client)".