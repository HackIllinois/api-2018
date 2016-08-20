var UnprocessableRequestError = require('./UnprocessableRequestError.js');

var ERROR_TYPE = 'EntityNotSupportedError';
var ERROR_TITLE = 'Entity Not Supported';
var ERROR_STATUS = 415;

var DEFAULT_MESSAGE = "The provided entity cannot be handled by this resource";

function EntityNotSupportedError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.status = ERROR_STATUS;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

EntityNotSupportedError.prototype = Object.create(UnprocessableRequestError.prototype);
EntityNotSupportedError.prototype.constructor = EntityNotSupportedError;

module.exports = EntityNotSupportedError;
