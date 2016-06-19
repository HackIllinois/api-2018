var ERROR_TYPE = 'ApiError';
var ERROR_TITLE = 'API Error';
var STATUS_CODE = 500;

var DEFAULT_MESSAGE = "An error occurred. If this persists, please contact us";

function ApiError(message, source) {
  this.type = ERROR_TYPE;
  this.status = STATUS_CODE;
  this.title = ERROR_TITLE;
  this.message = (message) ? message : DEFAULT_MESSAGE;
  this.source = (source) ? source : null;

  this.isApiError = true;
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.toJSON = function() {
  return {
	type: this.type,
	status: this.status,
	title: this.title,
	message: this.message,
	source: this.source
  };
};

module.exports = ApiError;
