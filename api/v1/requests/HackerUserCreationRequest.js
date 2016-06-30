var Request = require('./Request');

var required = ['email', 'password', 'confirmedPassword'];
var validations = {
	'email': ['email'],
	'password': ['string', 'minLength:8'],
	'confirmedPassword': [{ rule: 'matchesField:password',
		message: "The confirmed password must match the password" }]
};

// usable whenever a request is made to create a Hacker
function HackerUserCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

HackerUserCreationRequest.prototype = Object.create(Request.prototype);
HackerUserCreationRequest.prototype.constructor = HackerUserCreationRequest;

module.exports = HackerUserCreationRequest;
