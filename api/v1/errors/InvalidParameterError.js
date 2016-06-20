var UnprocessableRequestError = require('./UnprocessableRequestError.js');

var ERROR_TYPE = 'InvalidParameterError';
var ERROR_TITLE = 'Invalid Parameter';

var DEFAULT_MESSAGE = "One or more parameters present in the request were invalid";

function InvalidParameterError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

InvalidParameterError.prototype = Object.create(UnprocessableRequestError.prototype);
InvalidParameterError.prototype.constructor = InvalidParameterError;

module.exports = InvalidParameterError;
