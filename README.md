# Application test:

## Introduction:

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