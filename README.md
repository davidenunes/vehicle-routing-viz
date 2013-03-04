# Vehicle Routing Visualisation
This is a visualisation application written in [Node.js](http://nodejs.org/) used to display simple
vehicle routing information in a page using the [Google Maps JavaScript API v3](https://developers.google.com/maps/documentation/javascript/reference).

The *Node.js* server provides a way to link other applications such as vehicle routing simulators to the Google Maps canvas 
via a simple Web interface. To provide the Web interface, we used the [Express.js](http://expressjs.com/) framework for *Node.js*.
To communicate with the visualisation pages containing Google Maps canvas, we used the [Socket.io](http://socket.io/). This provides a 
flexible API that allows for asynchronous communication using *WebSockets*. 

Finaly, we used the [EPoly Google Maps API Extension](http://econym.org.uk/gmap/epoly.htm) to visualise markers moving along 
existing routes.

#Usage
To run the visualisation server you need to install [Node.js](http://nodejs.org/). To install extra modules for *Node.js*
(such as *Socket.io* and *Express*) you can use the [Node Package Modules](https://npmjs.org/).

To run this demo, you just need to execute the `routing_server.js` with node. This can be done as follows:

```bash
nodejs routing_server.js
```
This starts the server which means you are ready to make requests and visualise the results. To visualise the 
results on a map, you just need to open the `routing_client.html` file. If the server is running, this client 
will connect to it and wait for instructions.

## Test the Visualisation API
To test the visualisation API you don't need a particular application. Just Open your browser and type for instance
`http://localhost:6969/api`

You should receive the message: `OK`

## Visualisation Web API commands
**Dummy Server Check** : `http://localhost:6969/api` - dummy method that returns `OK` if the web browser is able to send a request to the visualisation server.


# Licence
Vehicle Routing Visualisation

* Copyright (C) 2013 Davide Nunes
* Authors : Davide Nunes davex.pt@gmail.com
* Contributors: alphalinkman@gmail.com

The Vehicle Routing Visualisation is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

The Vehicle Routing Visualisation is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with the b-have sweeper library.
If not, see GPL 3.0.
