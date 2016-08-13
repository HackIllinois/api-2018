var Request = require('./Request');

var required = ['email'];
var validations = {
	'email': ['string']
};

function ResetPasswordRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

ResetPasswordRequest.prototype = Object.create(Request.prototype);
ResetPasswordRequest.prototype.constructor = ResetPasswordRequest;

module.exports = ResetPasswordRequest;
