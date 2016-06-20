var ApiError = require('./ApiError');

var ERROR_TYPE = 'UnauthorizedError';
var ERROR_TITLE = 'Unauthorized';

var DEFAULT_MESSAGE = "The requested resource cannot be accessed with the " +
	"provided credentials";
var STATUS_CODE = 401;

function UnauthorizedError(message, source) {
	ApiError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.status = STATUS_CODE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

UnauthorizedError.prototype = Object.create(ApiError.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

module.exports = UnauthorizedError;
