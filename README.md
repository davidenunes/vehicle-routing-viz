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

To do this, run 

```bash
npm install socket.io
npm install express
```

after the node modules are installed you are ready to run the demo.

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

## Visualisation Web API
**Note** : note that the address `localhost` and the port `6969` are values for the host and port that should be used if you 
are just running the application locally you can obviously change these values based on the machine running the visualisation server 
and the port you set in the `routing_server.js` file. The visualisation client (routing_client.html) should be opened after you run routing_server.js as
it will try to connect to the server.

**Dummy Server Check** : `http://localhost:6969/api` - dummy method that returns `OK` if the web browser is able to send a request to the visualisation server.

**Set Map Center** : `http://localhost:6969/api/set/mapcenter/:lat/:lng` - sets the map center to a given latitude and longitude. As an example `http://localhost:6969/api/set/mapcenter/1/1`
sets the map center to the coordinates `(1,1)`

**Add Marker** : `http://localhost:6969/api/add/marker/:id/:color/:lat/:lng/:title` - adds a generic marker to the map: 
* :id - is the id of the marker 
* :color - is the color for the marker (for example #FE7569)
* :lat - the latitude of the marker
* :lng - the longitude of the marker
* :title - a title or name for the marker

**Add Worker** : `http://localhost:6969/api/add/worker/:id/:lat/:lng/:name` - adds a worker / vehicle marker to the map:
* :id - is the id of the worker
* :lat - worker latitude
* :lng - worker longitude
* :name - a textual name for the worker

**Set Worker Position** : `http://localhost:6969/api/set/worker/position/:workerID/:lat/:lng` - sets the position of the given worker to a coordinate:
* :workerID - worker id
* :lat - new worker latitude
* :lng - new worker longitude

**Add Job** : `http://localhost:6969/api/add/job/:id/:lat/:lng/:title` - adds a job marker to the map:
* :id - is the id of the job
* :lat - job latitude
* :lng - job longitude
* :title - a textual name or title for the job

**Add Depot** : `http://localhost:6969/api/add/depot/:id/:lat/:lng/:title` - adds a depot / base marker to the map:
* :id - is the id of the depot
* :lat - depot latitude
* :lng - depot longitude
* :title - a textual name or title for the depot

**Add Route** : `http://localhost:6969/api/add/route/:id/:lat1/:lng1/:lat2/:lng2` - uses the Google Directions api to 
add a route between two coordinates to the map:
* :id - route id
* :lat1 - route starting latitude
* :lng1 - route starting longitude
* :lat2 - route ending latitude
* :lng2 - route ending longitude

**Remove Route** : `http://localhost:6969/api/remove/route/:id` - removes a previously added route from the map:
* :id - route id

**Remove Depot** : `http://localhost:6969/api/remove/depot/:id` - removes a depot from the map based on its *id*:
* :id - depot id

**Remove Job** : `http://hocalhost:6969/api/remove/job/:id` - removes a previously added job from the map :
* :id -  job id 

**Remove Worker** : `http://localhost:6969/api/remove/worker/:id` - removes a previously added worker from the map:
* :id -  worker id 

**Complete Job** : `http://localhost:6969/api/set/job/done/:id` - sets an existing job as done (simply changes its marker in this case):
* :id -  job id 

**Clear the Map** : `http://localhost:6969/api/remove/all` - removes all the objects from the map.

**Move Worker in a Route** : `http://localhost:6969/api/update/worker/position/:workerID/:routeID/:distance` - moves a worker in a route given a distance counting from the start of the route:
* :workerID - worker id
* :routeID - route id
* :distance - a distance in meters counting from the start of the route

**Get Worker Position** : `http://localhost:6969/api/get/worker/position/:workerID` - returns the current coordinates for the given worker:
* :workerID - the id of the worker
* response: `lat;lng`

This is the only method in this demo that returns some kind of state for the map. It might be useful if one needs 
to determine the actual coordinate of a Worker (for instance if this in the middle of an existing route and
needs to be re-routed).

# Licence
Vehicle Routing Visualisation

* Copyright (C) 2013  [Laboratory of Agent Modelling (LabMAg)](http://labmag.ul.pt/)
* Authors : [Davide Nunes](http://davidenunes.com) davidelnunes@gmail.com 

The Vehicle Routing Visualisation is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

The Vehicle Routing Visualisation is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with the b-have sweeper library.
If not, see GPL 3.0.
