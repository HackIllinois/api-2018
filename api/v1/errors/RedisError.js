const ApiError = require('./ApiError');

const ERROR_TYPE = 'RedisError';
const ERROR_TITLE = 'Redis Error';

const DEFAULT_MESSAGE = 'The key provided does not exist in the Redis DB';

function RedisError(message, source) {
  ApiError.call(this, message, source);

  this.type = ERROR_TYPE;
  this.title = ERROR_TITLE;
  this.message = (message) ? message : DEFAULT_MESSAGE;
}

RedisError.prototype = Object.create(ApiError.prototype);
RedisError.prototype.constructor = RedisError;

module.exports = RedisError;
