# Question 1

## Running the server
### Install socket.io (only dependency Node.js-side)
```
npm install
```
### Run signaling server
```
npm start
```
## Running the client
The client is a self-contained web page (with external scripts served from CDNs) and could be found in ```/app/client/client.htm```.

# Question 2
The implemented P2P architecture is the Mesh architecture, in which every client is connected to all other peers, while this architecture provides the most flexibility and possibility to exploit each peer's resource. The number of connections scale exponentially the more user you have, which could be a problem in network resources (socket, ports, etc) and also very difficult to maintain and scale effectively.

![Mesh P2P architecture](https://raw.githubusercontent.com/tri170391/webRTC-test/master/mesh_architecture.png)

On the other spectrum there are the ring architecture where the amount of connection is minimized (n+1 for n peers). But the trade off is bigger delay and a bottleneck in the weakest link. Though an alternative least connection network is the star architecture, this works well especially if we can estimate the bandwidth between peers, building a least-cost spanning tree connecting all peers. But nevertheless we trade ability to contact anyone at any time to have the number of connections scale linearly instead. But nevertheless it opens the possibility of Hybrid P2P system where we have "seeders" who stay in the center of the star to spread out the data before it goes into weaker and less reliable peers.

![Circular  P2P architecture](https://raw.githubusercontent.com/tri170391/webRTC-test/master/circular_architecture.png)
![Star/Mixer  P2P architecture](https://raw.githubusercontent.com/tri170391/webRTC-test/master/circular_architecture.png)

While we have explored the two end of the spectrum, the possibility of a middle-ground solution exists and is better to adapt to different needs. One such architecture is the star-of-meshes, where instead of letting all users connect to each other into an unsustainable mesh. We could instead group the user into small group in which they are organized as a mesh (and better if they have good connection to each other) and connect each group using "gateways" peers who seed data into the small meshes. Though such an architecture is trickier to manage, design and maintain.