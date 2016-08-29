/* jshint esversion: 6 */

const MILLISECONDS_PER_SECOND = 1000;

var milliseconds = require('ms');

module.exports.unix = function () {
	return Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
};

module.exports.toMilliseconds = function (description) {
	return milliseconds(description);
};
