var fs = require("fs");
var logger = require("winston");
var path = require("path");

var DEFAULT_BANNER = "HACKILLINOIS API (2017)";
var BANNER_LOCATION = "../resources/banner.txt";

// sets up logger to work with cli
// we will need to set up a more robust system in the future
logger.cli();

console.log();
try {
	var bannerPath = path.join(__dirname, BANNER_LOCATION);
	var banner = fs.readFileSync(bannerPath, { encoding: 'utf8' });
	console.log(banner);
} catch (e) {
	if (e.code === 'ENOENT') {
		console.log(DEFAULT_BANNER);
	} else {
		throw e;
	}
}
console.log();

module.exports = logger;
