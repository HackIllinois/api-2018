const UnprocessableRequestError = require('./UnprocessableRequestError.js');

const ERROR_TYPE = 'InvalidParameterError';
const ERROR_TITLE = 'Invalid Parameter';

const DEFAULT_MESSAGE = 'One or more parameters present in the request were invalid';

function InvalidParameterError(message, source) {
  UnprocessableRequestError.call(this, message, source);

  this.type = ERROR_TYPE;
  this.title = ERROR_TITLE;
  this.message = (message) ? message : DEFAULT_MESSAGE;
  this.source = (source) ? source : null;
}

InvalidParameterError.prototype = Object.create(UnprocessableRequestError.prototype);
InvalidParameterError.prototype.constructor = InvalidParameterError;

module.exports = InvalidParameterError;
