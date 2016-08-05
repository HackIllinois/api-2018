var ApiError = require('./ApiError');

var ERROR_TYPE = 'RateLimitError';
var ERROR_TITLE = 'Rate Limit Exceeded';
var STATUS_CODE = 429;

var DEFAULT_MESSAGE = "Too many requests were received";

function RateLimitError(message, source) {
	ApiError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.status = STATUS_CODE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
}

RateLimitError.prototype = Object.create(ApiError.prototype);
RateLimitError.prototype.constructor = RateLimitError;

module.exports = RateLimitError;
