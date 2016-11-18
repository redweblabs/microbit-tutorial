// include micro bit module
var BBCMicrobit = require('bbc-microbit')
	// include the express module
var express = require('express');
// create an app using the express module
var app = express();
// set up a web server
var server = require('http').Server(app);
// include socket.io (used to send messages to a webpage from this code)
var io = require('socket.io')(server);
// start the server on port 3000
server.listen(3000);
// our pages wil use the pug templating language
app.set('view engine', 'pug');
// when the page is visited, show them the index page
app.get("/", function(req, res) {
	res.render("index");
});
// use the public folder for everything else
app.use(express.static('public'));
//
console.log("visit http://localhost:3000");


// define a microbit
var Microbit = function(band, id) {

	var mb = this;

	// this holds the microbit object generate by connecting to the microbit
	mb.microbit = false;

	// this function connects to the microbit
	mb.connect = function() {
		console.log("looking for band #" + (band + 1));
		BBCMicrobit.discoverById(id, function(microbit) {
			console.log("connected to band " + (band + 1));
			mb.microbit = microbit;
			mb.microbit.connectAndSetUp(mb.setup);
		});
	}

	// this sets up the microbit once the computer has connected to it.
	mb.setup = function(err) {
		// if there is no error
		if (!err) {
			// set the update time of the magnetometer to 80 milliseconds
			mb.microbit.writeMagnetometerPeriod(80, function() {
				// subscribe to the updates
				mb.microbit.subscribeMagnetometer(function() {
					// on every update then pass a message to the webpage.
					mb.microbit.on('magnetometerChange', function(x, y, z) {
						io.sockets.emit('m', {
							band: band,
							x: x,
							y: y,
							z: z
						});
					});
				});
			});

			// when the microbit disconnects, try to connect to it again.
			mb.microbit.once('disconnect', function() {
				console.log("disconnected from band " + (band + 1));
				mb.microbit = false;
				mb.connect();
			});
		}
	}

	// try to connect to the band
	mb.connect();

	return mb;
}

// defining the band, you will need to the id of you own microbits here;

var band0 = new Microbit(0, "*** Replace with an ID from discover.js ***");

var band1 = new Microbit(1, "*** Replace with an ID from discover.js ***");

var band2 = new Microbit(2, "*** Replace with an ID from discover.js ***");

var band3 = new Microbit(3, "*** Replace with an ID from discover.js ***");
