var Request = require('./Request');

var required = ['email', 'password'];
var validations = {
	'email': ['email'],
	'password': ['string', 'minLength:8']
};

function AuthTokenRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

AuthTokenRequest.prototype = Object.create(Request.prototype);
AuthTokenRequest.prototype.constructor = AuthTokenRequest;

module.exports = AuthTokenRequest;
