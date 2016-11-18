var Microbit = function(band) {
	var mb = this;

	// set the volume to 0;
	mb.volume = 0;

	// this array keeps the most recent motion values so we can create an average
	mb.values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	// these are arrays of the last few differences in motion readings
	var differences = {
		x: [0, 0, 0],
		y: [0, 0, 0],
		z: [0, 0, 0]
	}

	// this object keeps the last readings so we can calculate the difference each update
	var lastValues = {
		x: 0,
		y: 0,
		z: 0
	};

	// this function is run each time we get a reading fromt the sensor
	mb.update = function(newValues) {

		// this object is the differences in between sensor readings
		var difference = {
			x: parseInt(Math.abs(newValues.x - lastValues.x)),
			y: parseInt(Math.abs(newValues.y - lastValues.y)),
			z: parseInt(Math.abs(newValues.z - lastValues.z))
		}

		// now we have worked out the difference, we can update the lastValues ready for the next update.
		lastValues = newValues;

		// sometimes the gyroscope flips from -180 to 180, these statements filter out those
		differences.x.update((difference.x < 50) ? difference.x : null);
		differences.y.update((difference.y < 50) ? difference.y : null);
		differences.z.update((difference.z < 50) ? difference.z : null);

		// now we update the recent values array with the averages of differences
		mb.values.update(differences.x.average() + differences.y.average() + differences.z.average());

		// now we update the volume, but limit it to under 1
		var volume = (mb.values.average() < 50) ? mb.values.average() / 50 : 1;

		// set the volume, but if the volume is under 5% then mute it.
		tracks[band].volume = volume;
		mb.volume = volume;

		// update the height of the bar  to reflect the volume!
		document.querySelector(".band" + band).style.height = (volume * 100) + "%";

	}

	// add a bit of decay to lower values automatically
	setInterval(function() {
		mb.values.update(mb.values.average() / 2);
	}, 80);

	return mb;
}

// connect to the node js process
var socket = io.connect();

// when the connection receives data from the socket, then update that band
socket.on('m', function(data) {
	bands[data.band].update({
		x: data.x,
		y: data.y,
		z: data.z
	});
});


// this function updates the global speed of all the things depending all the sensors added up.
function updateSpeed() {

	var speed = (bands[0].values.average() + bands[1].values.average() + bands[2].values.average() + bands[3].values.average()) / 4;

	// divide the speed by 40 to make it reasonable.
	speed = 0.5 + speed / 40;

	// update all the tracks with that speed
	tracks[0].playbackRate = speed;
	tracks[1].playbackRate = speed;
	tracks[2].playbackRate = speed;
	tracks[3].playbackRate = speed;

	// update the speed indicator, using the average volume since its easier to work with.
	document.querySelector(".speed").style.bottom = ([bands[0].volume, bands[1].volume, bands[2].volume, bands[3].volume].average() * 100) + "%";

}

// here we define the 4 tracks and the mp3 files that each one used
var tracks = [
	new Audio('beat.mp3'),
	new Audio('guitar.mp3'),
	new Audio('piano.mp3'),
	new Audio('sticks.mp3')
];

// this for loop initialises each of the tracks
for (var i = 0; i < tracks.length; i++) {

	// set the volume to 0
	tracks[i].volume = 0;

	// this bit of code makes the loops slightly smoother
	tracks[i].addEventListener('timeupdate', function() {
		if (this.currentTime >= this.duration - 2) {
			this.currentTime = 0;
			this.play();
		}
	}, false);

	// play the track
	tracks[i].play();
}

// this array creates all of our microbits
var bands = [new Microbit(0), new Microbit(1), new Microbit(2), new Microbit(3)];

// every 1/10th of a second we update the speed of the tracks
setInterval(function() {
	updateSpeed();
}, 100);


// this adds a function to our array so we can easily create an average out of it.
Array.prototype.average = function() {
	var total = 0;
	for (var i = 0; i < this.length; i++) {
		total += this[i];
	}
	return total / this.length;
}

// this adds a functon to our array so we can easily replace the oldest value with a newer one.
Array.prototype.update = function(value) {
	if (value !== null) {
		this.push(value);
		this.shift();
	}
	return this;
}
