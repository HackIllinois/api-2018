var ApiError = require('./ApiError');

var ERROR_TYPE = 'NotFoundError';
var ERROR_TITLE = 'Not Found';
var STATUS_CODE = 404;

var DEFAULT_MESSAGE = 'The requested resource could not be found';

function NotFoundError(message, source) {
    ApiError.call(this, message, source);

    this.type = ERROR_TYPE;
    this.status = STATUS_CODE;
    this.title = ERROR_TITLE;
    this.message = (message) ? message : DEFAULT_MESSAGE;
    this.source = (source) ? source : null;
}

NotFoundError.prototype = Object.create(ApiError.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;
