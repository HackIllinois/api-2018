var ApiError = require('./ApiError');

var ERROR_TYPE = 'TokenExpirationError';
var ERROR_TITLE = 'Token Expired';

var DEFAULT_MESSAGE = "The provided token has expired";
var STATUS_CODE = 401;

function TokenExpirationError(message, source) {
	ApiError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.status = STATUS_CODE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

TokenExpirationError.prototype = Object.create(ApiError.prototype);
TokenExpirationError.prototype.constructor = TokenExpirationError;

module.exports = TokenExpirationError;
