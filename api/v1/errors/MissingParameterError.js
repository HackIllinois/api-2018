const UnprocessableRequestError = require('./UnprocessableRequestError');

const ERROR_TYPE = 'MissingParameterError';
const ERROR_TITLE = 'Missing Parameter';

const DEFAULT_MESSAGE = 'One or more parameters were missing from the request';

function MissingParameterError(message, source) {
  UnprocessableRequestError.call(this, message, source);

  this.type = ERROR_TYPE;
  this.title = ERROR_TITLE;
  this.message = (message) ? message : DEFAULT_MESSAGE;
  this.source = (source) ? source : null;
}

MissingParameterError.prototype = Object.create(UnprocessableRequestError.prototype);
MissingParameterError.prototype.constructor = MissingParameterError;

module.exports = MissingParameterError;
