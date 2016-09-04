var Request = require('./Request');

var bodyRequired = ['email', 'password'];
var bodyValidations = {
	'email': ['email'],
	'password': ['string', 'minLength:8']
};

function AuthTokenRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

AuthTokenRequest.prototype = Object.create(Request.prototype);
AuthTokenRequest.prototype.constructor = AuthTokenRequest;

module.exports = AuthTokenRequest;
