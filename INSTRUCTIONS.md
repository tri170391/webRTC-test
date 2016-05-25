#Instructions

## Requirements

- Keep in mind that we'll focus on code efficiency and readability.
- You shall provide some code that you consider **production ready**.
- The single objective of this test is to evaluate how you handle the business logic, not the UI/UX. **Do not waste your time on front-end stuff**.

## How to answer this test

Do **not** fork this repository on github. Instead please follow these steps:
- clone this repository: `git clone https://github.com/streamroot/webRTC-test`
- create a new empty github repository (please do not use the  “Streamroot” brand name in the repository's name, as it's a registred trademark)
- remove streamroot's remote on your local git `git remote remove origin`
- add your repository to your local git `git remote add origin git@github.com:< … >`
- commit and push as usual on your github repository.

## Questions

### 1. Create a peer to peer application that allows several peers to send message to each other

- There should be a single page (no separation between caller & callee)
- once on the page, they must see the list of all other peers connected
- a peer connection must be established with every other peers immediately after the connection to the page.
- they must be able to send message to any other connected peers directly. (unicast message, broadcast not needed)

What are the problem of this architecture ?

### 2. New architecture: instead of realizing the WebRTC signaling using the signaling server, we will now use an hybrid approach

- each time a peer connects to the page, the signaling server only gives him 1 peer to connect to. (the peer is chosen at random)
- once he's connected to this peer, he ask the complete  list of peers.
- then he connects to every peers using the first peer as a signaling channel.

How many peer connection can be opened on a single computer ?
