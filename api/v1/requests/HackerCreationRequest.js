var Request = require('./Request');

var required = ['email', 'password', 'confirmedPassword'];
var validations = {
	'email': ['email'],
	'password': ['string', 'minLength:8'],
	'confirmedPassword': [{ rule: 'matchesField:password',
		message: "The confirmed password must match the password" }]
};

function HackerCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

HackerCreationRequest.prototype = Object.create(Request.prototype);
HackerCreationRequest.prototype.constructor = HackerCreationRequest;

module.exports = HackerCreationRequest;
