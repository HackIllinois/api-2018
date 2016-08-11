var UnprocessableRequestError = require('./UnprocessableRequestError');

var ERROR_TYPE = 'ExistsError';
var ERROR_TITLE = 'Already Exists';

var DEFAULT_MESSAGE = "The resource described already exists";

function ExistsError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
}

ExistsError.prototype = Object.create(UnprocessableRequestError.prototype);
ExistsError.prototype.constructor = ExistsError;

module.exports = ExistsError;
