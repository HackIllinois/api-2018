var UnprocessableRequestError = require('./UnprocessableRequestError.js');

var ERROR_TYPE = 'InvalidUploadError';
var ERROR_TITLE = 'Invalid Upload';

var DEFAULT_MESSAGE = "The uploaded content had one or more invalid attributes";

function InvalidUploadError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

InvalidUploadError.prototype = Object.create(UnprocessableRequestError.prototype);
InvalidUploadError.prototype.constructor = InvalidUploadError;

module.exports = InvalidUploadError;
