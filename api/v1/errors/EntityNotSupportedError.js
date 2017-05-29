const UnprocessableRequestError = require('./UnprocessableRequestError.js');

const ERROR_TYPE = 'EntityNotSupportedError';
const ERROR_TITLE = 'Entity Not Supported';
const ERROR_STATUS = 415;

const DEFAULT_MESSAGE = 'The provided entity cannot be handled by this resource';

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
