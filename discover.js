var BBCMicrobit = require('bbc-microbit')

BBCMicrobit.discoverAll(function(microbit) {
	console.log("--------------\nDISCOVERED MICROBIT WITH ID:\n"+microbit.id);
});
