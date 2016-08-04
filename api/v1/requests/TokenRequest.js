var Request = require('./Request');

var required = ['token', 'password'];
var validations = {
	'token': ['string'],
	'password': ['string', 'minLength:8']
};

function TokenRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

TokenRequest.prototype = Object.create(Request.prototype);
TokenRequest.prototype.constructor = TokenRequest;

module.exports = TokenRequest;
