var UnprocessableRequestError = require('./UnprocessableRequestError');

var ERROR_TYPE = 'MissingParameterError';
var ERROR_TITLE = 'Missing Parameter';

var DEFAULT_DETAIL = "One or more parameters were missing from the request.";

function MissingParameterError(detail, source) {
  UnprocessableRequestError.call(this, detail, source);

  this.type = ERROR_TYPE;
  this.title = ERROR_TITLE;
  this.detail = (detail) ? detail : DEFAULT_DETAIL;
  this.source = (source) ? source : undefined;
}

MissingParameterError.prototype = Object.create(UnprocessableRequestError.prototype);
MissingParameterError.prototype.constructor = MissingParameterError;

module.exports = MissingParameterError;
