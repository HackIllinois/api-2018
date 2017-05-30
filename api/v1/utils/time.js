/* jshint esversion: 6 */

const MILLISECONDS_PER_SECOND = 1000;

const milliseconds = require('ms');

module.exports.unix = function () {
	return Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
};

module.exports.toMilliseconds = function (description) {
	return milliseconds(description);
};

module.exports.verifyDate= function(date) {
	return !!Date.parse(date);
};

module.exports.secondsToHHMMSS = function (numSeconds) {
	numSeconds = Number(numSeconds);
	const h = Math.floor(numSeconds / 3600);
	const m = Math.floor(numSeconds % 3600 / 60);
	const s = Math.floor(numSeconds % 3600 % 60);
	return ((h > 0 ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s);
};
