const UnprocessableRequestError = require('./UnprocessableRequestError.js');

const ERROR_TYPE = 'EntityTooLargeError';
const ERROR_TITLE = 'Entity Too Large';
const ERROR_STATUS = 413;

const DEFAULT_MESSAGE = 'The provided entity was too large';

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
