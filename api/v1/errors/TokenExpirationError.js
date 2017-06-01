const ApiError = require('./ApiError');

const ERROR_TYPE = 'TokenExpirationError';
const ERROR_TITLE = 'Token Expired';

const DEFAULT_MESSAGE = 'The provided token has expired';
const STATUS_CODE = 401;

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
