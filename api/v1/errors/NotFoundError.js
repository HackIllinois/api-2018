const ApiError = require('./ApiError');

const ERROR_TYPE = 'NotFoundError';
const ERROR_TITLE = 'Not Found';
const STATUS_CODE = 404;

const DEFAULT_MESSAGE = 'The requested resource could not be found';

function NotFoundError(message, source) {
	ApiError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.status = STATUS_CODE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

NotFoundError.prototype = Object.create(ApiError.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;
