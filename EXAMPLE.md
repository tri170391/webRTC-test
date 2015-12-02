# Simple WebRTC example

A very simple webRTC application can be found in the `/app` directory. It's composed of 3 different parts :

- a signaling server (`/app/server/SignalingServer.js`) which is a websocket server written in node.js and used as a signaling mechanism for webRTC.
- a **caller** webpage (`app/client/caller.html`), which is able to establish a communication with the **callee**.
- a **callee** webpage (`app/client/callee.html`), which can be contacted by the **caller** and communicate with it.

## Launching the app

First run `npm install` to install dependencies. Then run `npm start` (it starts the signaling server on port 8090 and starts a web server on the root of this repository on port 8089).

In two different tabs, open [the caller page](http://localhost:8089/app/client/caller.html) and [the callee one](http://localhost:8089/app/client/callee.html).

In the **caller** page, press the `Start` button. Send message for one page to another, writing text in the text box, and sending it with the `Send message` button.

## Unit tests

The unit tests can be found in the `test/` directory.

#### run tests

    npm test

#### tools

- [mocha](http://mochajs.org/)
- [sinonjs](http://sinonjs.org/docs/)
- [shouldjs](shouldjs.github.io)
