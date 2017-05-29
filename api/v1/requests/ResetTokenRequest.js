var Request = require('./Request');

var bodyRequired = ['email'];
var bodyValidations = {
	'email': ['email']
};

function ResetTokenRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

ResetTokenRequest.prototype = Object.create(Request.prototype);
ResetTokenRequest.prototype.constructor = ResetTokenRequest;

module.exports = ResetTokenRequest;
