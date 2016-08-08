var Request = require('./Request');

var required = ['content', 'type', 'length', 'name'];
var validations = {
	'content': ['string', 'exactLength:32'],
	'type': ['string', 'between:1:255'],
	'length': ['naturalNonZero'],
	'name': ['string']
};

function UploadRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

UploadRequest.prototype = Object.create(Request.prototype);
UploadRequest.prototype.constructor = UploadRequest;

module.exports = UploadRequest;
