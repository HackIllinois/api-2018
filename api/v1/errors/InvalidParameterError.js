var UnprocessableRequestError = require('./UnprocessableRequestError');

var ERROR_TYPE = 'InvalidParameterError';
var ERROR_TITLE = 'Invalid Parameter';

var DEFAULT_DETAIL = "One or more parameters present in the request were invalid.";

function InvalidParameterError(detail, source) {
  UnprocessableRequestError.call(this, detail, source);

  this.type = ERROR_TYPE;
  this.title = ERROR_TITLE;
  this.detail = (detail) ? detail : DEFAULT_DETAIL;
  this.source = (source) ? source : undefined;
}

InvalidParameterError.prototype = Object.create(UnprocessableRequestError.prototype);
InvalidParameterError.prototype.constructor = InvalidParameterError;

module.exports = InvalidParameterError;
