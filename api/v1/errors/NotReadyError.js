var ApiError = require('./ApiError');

var ERROR_TYPE = 'NotReadyError';
var ERROR_TITLE = 'Not Ready';
var STATUS_CODE = 315; // NOTE: this is not a standard HTTP code

var DEFAULT_MESSAGE = "The requested resource exists, but is not available yet";

function NotReadyError(message, source) {
	ApiError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.status = STATUS_CODE;
	this.title = ERROR_TITLE;
}

NotReadyError.prototype = Object.create(ApiError.prototype);
NotReadyError.prototype.constructor = NotReadyError;

module.exports = NotReadyError;
