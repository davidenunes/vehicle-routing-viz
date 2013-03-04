/**
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/



/**
* HTTP INTERFACE FOR VEHICLE ROUTING VISUALISATION
* 
* This is a node.js application that provides an interface
* for the vehicle routing visualiser that uses Google Maps
* to draw routes, jobs and vehicles. 
*
* This server is used to allow for Google Maps API calls without
* interacting directly with the page or using other server side 
* technology that needs to perform a page refresh in order to update
* the visualisation state.
*
* We use web sockets to establish a direct connection between the 
* HTML client page displaying the map and the server that serves as
* a generic RESTFULL-like interface to this map.
*
* author: Davide Nunes
* webpage: http://davidenunes.com
*/

var application_root = __dirname,
express = require("express"),
path = require("path");

var app = express();

var pendingHttpResponse;




//Configure express framework web app
app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

/**********************************************************************
* CHECK THE CONNECTINO TO THE API
*
* dummy method returns OK if http://localhost:6969/api is requested
***********************************************************************/
app.get('/api', function (request, result){
	result.send('OK');
});


/**********************************************************************
* SET MAP CENTER
* query string should be something like: 
* "http://localhost:6969/api/set/mapcenter/2,4"
***********************************************************************/
app.get('/api/set/mapcenter/:lat/:lng', function (req, res){
	console.log('mapcenter set');
	io.sockets.emit('setMapCenter', req.params.lat, req.params.lng);	
	res.send('OK');
});

/**********************************************************************
* ADD A MARKER TO THE MAP
*
* Adds a generic marker to the map
***********************************************************************/
app.get('/api/add/marker/:id/:color/:lat/:lng/:title', function(req, res){
      var id = req.params.id;
      var color = req.params.color;
      var lat = req.params.lat;
      var lng = req.params.lng;
      var title = req.params.title;
      
      console.log(req);
      
      io.sockets.emit('addMarker', id, color, lat, lng, title);
      res.send('OK');
  
});

/**********************************************************************
* ADD A WORKER TO THE MAP
*
* Places a Worker Marker in a given (latitude, longitude) 
* with a given name.
***********************************************************************/
app.get('/api/add/worker/:id/:lat/:lng/:name', function(req, res){
      var id = req.params.id;
      var lat = req.params.lat;
      var lng = req.params.lng;
      var name = req.params.name;
      
      console.log(req);
      
      io.sockets.emit('addWorker', id, lat, lng, name);
      res.send('OK');
  
});

/**********************************************************************
* ADD A JOB TO THE MAP
*
* Places a Worker Marker in a given (latitude, longitude) with a 
* given title or name
***********************************************************************/
app.get('/api/add/job/:id/:lat/:lng/:title', function(req, res){
      var id = req.params.id;
      var lat = req.params.lat;
      var lng = req.params.lng;
      var title = req.params.title;
      
      console.log(req);
      
      io.sockets.emit('addJob', id, lat, lng, title);
      res.send('OK');
  
});
/**********************************************************************
* ADD A DEPOT
*
* Adds a depot marker to the map in a given (latitude, longitude)
* with a given ID and name or title
***********************************************************************/
app.get('/api/add/depot/:id/:lat/:lng/:title', function(req, res){
      var id = req.params.id;
      var lat = req.params.lat;
      var lng = req.params.lng;
      var title = req.params.title;
      
      console.log(req);
      
      io.sockets.emit('addDepot', id, lat, lng, title);
      res.send('OK');
  
});
/**********************************************************************
* REMOVE DEPOT
*
* Removes a depot from the map by ID
***********************************************************************/
app.get('/api/remove/depot/:id', function(req, res){
  var id = req.params.id;
  io.sockets.emit('removeDepot', id);
  res.send('OK');
});


/**********************************************************************
* REMOVE A PREVIOUSLY ADDED JOB
*
* Removes a job marker with a given id
***********************************************************************/
app.get('/api/remove/job/:id', function(req, res){
  var id = req.params.id;
  io.sockets.emit('removeJob', id);
  res.send('OK');
});

/**********************************************************************
* COMPLETE A PREVIOUSLY ADDED JOB
* 
* Changes a job marker to display its status as completed
***********************************************************************/
app.get('/api/set/job/done/:id', function(req, res){
  var id = req.params.id;
  io.sockets.emit('setJobDone', id);
  res.send('OK');
});

/**********************************************************************
* REMOVE A PREVIOUSLY ADDED WORKER
* 
* Removes a worker marker with a given id
***********************************************************************/
app.get('/api/remove/worker/:id', function(req, res){
  var id = req.params.id;
  io.sockets.emit('removeWorker', id);
  res.send('OK');
});

/**********************************************************************
* CLEAR MAP
*
* removes all the markers and routes from the map
***********************************************************************/
app.get('/api/remove/all', function(req, res){
  
  io.sockets.emit('removeAll');
  res.send('OK');
});


/**********************************************************************
* MOVE WORKER ON A ROUTE
*
* moves a worker along an existing route updating its position
* 
* params:
* 
* workerID - an id for the worker marker previously added
* routeID - an if for a previously added route
* distance - the distance travelled by the worker since the begining 
*            of the route in meters 
* 
* example: the worker moved 20 meters in the route 1
* note: this is not comulative. It allways places a worker in the route
*       counting a distance from the starting point.
*
***********************************************************************/
app.get('/api/update/worker/position/:workerID/:routeID/:distance', function(req, res){
  var workerID = req.params.workerID;
  var routeID = req.params.routeID;
  var distance = req.params.distance;
  
  io.sockets.emit('moveWorker', workerID, routeID, distance);
  res.send('OK');
  
});

/**********************************************************************
* GET WORKER POSITION
* 
* This might be usefull to know the exact (latitude, longitude) of a
* worker using the Google Maps API. 
* 
* Note: This is the only method that performs a query to the 
* visualisation client HTML page. The client should only be used to 
* draw the state of a vehicle routing simulation, nevertheless, this 
* can be usefull to know where exactly the workers are in a route 
* if necessary.
***********************************************************************/
app.get('/api/get/worker/position/:workerID', function(req,res){
  var workerID = req.params.workerID;
   io.sockets.emit('getWorkerPosition', workerID); 
  pendingHttpResponse = res; 
});




/**********************************************************************
* SET WORKER POSITION
* 
* Sets a worker marker position to a given (latitude, longitude)
***********************************************************************/
app.get('/api/set/worker/position/:workerID/:lat/:lng', function(req, res){
  var workerID = req.params.workerID;
  var lat = req.params.lat;
  var lng = req.params.lng;
  
   io.sockets.emit('setWorkerPosition', workerID, lat, lng);
   res.send('OK');
    
});
   


/************************************************************************************
* ADD A ROUTE TO THE MAP
*
* Adds a route to the map with a given id, starting coordinates and ending coordinates
* the route is drawn according to the google API.
*
* ex, http://localhost:6969/api/add/route/1/38.75609130/-9.15650370/38.757/-9.15651
************************************************************************************/
app.get('/api/add/route/:id/:lat1/:lng1/:lat2/:lng2', function(req,res){
  var id = req.params.id;
  var lat1 = req.params.lat1;
  var lng1 = req.params.lng1;
  var lat2 = req.params.lat2;
  var lng2 = req.params.lng2;
  
  io.sockets.emit('createRoute', id, lat1, lng1, lat2, lng2);
  
  res.send('OK'); 
});

/**********************************************************************
* REMOVE A PREVIOUSLY ADDED ROUTE
*
* Remove a route previously added to the map with a given ID
***********************************************************************/
app.get('/api/remove/route/:id', function(req, res){
  var id = req.params.id;
  io.sockets.emit('removeRoute', id);
  res.send('OK');
});


/**
* the express framework and socket.io are running at the same time
* in this case, the express framework supplies the basic HTTP interface
* for this server. The socket.io supplies the capability to communicate
* with the HTML visualisation client via web sockets.
*/

//start the server on a given port
var server = app.listen(6969);

//starts socket.io with the previous server instance
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	/**
	* Used to receive a response from the visualisation 
	* client regarding the worker position on a route.
	*/
      socket.on('workerPosition', 
		function(lat,lng){
		  pendingHttpResponse.send(lat+";"+lng);
		});
    
 });
