var UnprocessableRequestError = require('./UnprocessableRequestError.js');

var ERROR_TYPE = 'EntityTooLargeError';
var ERROR_TITLE = 'Entity Too Large';
var ERROR_STATUS = 413;

var DEFAULT_MESSAGE = "The provided entity was too large";

function EntityTooLargeError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.status = ERROR_STATUS;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

EntityTooLargeError.prototype = Object.create(UnprocessableRequestError.prototype);
EntityTooLargeError.prototype.constructor = EntityTooLargeError;

module.exports = EntityTooLargeError;
