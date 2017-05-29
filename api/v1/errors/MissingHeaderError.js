const UnprocessableRequestError = require('./UnprocessableRequestError');

const ERROR_TYPE = 'MissingHeaderError';
const ERROR_TITLE = 'Missing Header';

const DEFAULT_MESSAGE = 'One or more headers were missing from the request';

function MissingHeaderError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

MissingHeaderError.prototype = Object.create(UnprocessableRequestError.prototype);
MissingHeaderError.prototype.constructor = MissingHeaderError;

module.exports = MissingHeaderError;
