/* jshint esversion: 6 */

const MILLISECONDS_PER_SECOND = 1000;

module.exports.unix = function () {
	return Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
};
