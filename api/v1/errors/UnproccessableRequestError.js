var ApiError = require('./ApiError');

var ERROR_TYPE = 'UnprocessableRequestError';
var ERROR_TITLE = 'Unprocessable Request';
var STATUS_CODE = 400;

var DEFAULT_DETAIL = "The server received a request that could not be processed.";

function UnprocessableRequestError(detail, source) {
  ApiError.call(this, detail, source);

  this.type = ERROR_TYPE;
  this.code = ERROR_CODE;
  this.status = STATUS_CODE;
  this.title = ERROR_TITLE;
  this.detail = (detail) ? detail : DEFAULT_DETAIL;
  this.source = (source) ? source : undefined;
}

UnprocessableRequestError.prototype = Object.create(ApiError.prototype);
UnprocessableRequestError.prototype.constructor = UnprocessableRequestError;

module.exports = UnprocessableRequestError;
