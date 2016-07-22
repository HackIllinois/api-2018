var ApiError = require('./ApiError');

var ERROR_TYPE = 'ExternalProviderError';
var ERROR_TITLE = 'External Provider Error';
var STATUS_CODE = 500;

function ExternalProviderError(message, source) {
	ApiError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.status = STATUS_CODE;
	this.title = ERROR_TITLE;

	this.isApiError = false;
}

ExternalProviderError.prototype = Object.create(ApiError.prototype);
ExternalProviderError.prototype.constructor = ExternalProviderError;

module.exports = ExternalProviderError;
