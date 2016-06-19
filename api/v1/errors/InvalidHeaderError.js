var UnprocessableRequestError = require('./UnprocessableRequestError');

var ERROR_TYPE = 'InvalidHeaderError';
var ERROR_TITLE = 'Invalid Header';

var DEFAULT_MESSAGE = "One or more headers present in the request were invalid";

function InvalidHeaderError(message, source) {
  UnprocessableRequestError.call(this, message, source);

  this.type = ERROR_TYPE;
  this.title = ERROR_TITLE;
  this.message = (message) ? message : DEFAULT_MESSAGE;
  this.source = (source) ? source : undefined;
}

InvalidHeaderError.prototype = Object.create(UnprocessableRequestError.prototype);
InvalidHeaderError.prototype.constructor = InvalidHeaderError;

module.exports = InvalidHeaderError;
