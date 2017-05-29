const ApiError = require('./ApiError');

const ERROR_TYPE = 'UnprocessableRequestError';
const ERROR_TITLE = 'Unprocessable Request';
const STATUS_CODE = 400;

const DEFAULT_MESSAGE = 'The server received a request that could not be processed';

function UnprocessableRequestError(message, source) {
	ApiError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.status = STATUS_CODE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

UnprocessableRequestError.prototype = Object.create(ApiError.prototype);
UnprocessableRequestError.prototype.constructor = UnprocessableRequestError;

module.exports = UnprocessableRequestError;
