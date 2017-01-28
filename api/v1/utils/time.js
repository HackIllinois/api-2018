/* jshint esversion: 6 */

const MILLISECONDS_PER_SECOND = 1000;

var milliseconds = require('ms');

module.exports.unix = function () {
	return Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
};

module.exports.toMilliseconds = function (description) {
	return milliseconds(description);
};

module.exports.sqlTime = function() {

	function pad (text) {
		var padding = "00";
		return text = padding.substring(0, padding.length - text.length) + text;
	}

	var date = new Date();
	var dateValues = (date.toLocaleDateString()).toString().split('/');

	return dateValues[2] + "-" + pad(dateValues[0]) + "-" + pad(dateValues[1]) + " " + pad(date.getHours()) +
	":" + pad(date.getMinutes())+":" + pad(date.getSeconds());
}