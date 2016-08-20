var Request = require('./Request');

var headersRequired = ['Content-Length', 'Content-Type'];

function UploadRequest(headers, body) {
	Request.call(this, headers, body);

	this.headersRequired = headersRequired;
}

UploadRequest.prototype = Object.create(Request.prototype);
UploadRequest.prototype.constructor = UploadRequest;

module.exports = UploadRequest;
