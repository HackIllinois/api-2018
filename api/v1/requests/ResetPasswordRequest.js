var Request = require('./Request');

var bodyRequired = ['token', 'password'];
var bodyValidations = {
	'token': ['string'],
	'password': ['string', 'minLength:8']
};

function ResetPasswordRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

ResetPasswordRequest.prototype = Object.create(Request.prototype);
ResetPasswordRequest.prototype.constructor = ResetPasswordRequest;

module.exports = ResetPasswordRequest;
