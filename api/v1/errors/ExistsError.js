const UnprocessableRequestError = require('./UnprocessableRequestError');

const ERROR_TYPE = 'ExistsError';
const ERROR_TITLE = 'Already Exists';

const DEFAULT_MESSAGE = 'The resource described already exists';

function ExistsError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
}

ExistsError.prototype = Object.create(UnprocessableRequestError.prototype);
ExistsError.prototype.constructor = ExistsError;

module.exports = ExistsError;
