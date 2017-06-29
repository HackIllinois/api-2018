const ApiError = require('./ApiError');

const ERROR_TYPE = 'UnauthorizedError';
const ERROR_TITLE = 'Unauthorized';

const DEFAULT_MESSAGE = 'The requested resource cannot be accessed with the ' +
	'provided credentials';
const STATUS_CODE = 401;

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
