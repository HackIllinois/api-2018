const Request = require('./Request');

const headerRequired = ['Content-Length', 'Content-Type'];

function UploadRequest(headers, body) {
  Request.call(this, headers, body);

  this.headerRequired = headerRequired;
}

UploadRequest.prototype = Object.create(Request.prototype);
UploadRequest.prototype.constructor = UploadRequest;

module.exports = UploadRequest;
