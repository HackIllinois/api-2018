var roles = require('../utils/roles');
var Request = require('./Request');

var required = ['email', 'password', 'confirmedPassword', 'role'];
var validations = {
	'email': ['email'],
	'password': ['string', 'minLength:8'],
	'confirmedPassword': [{ rule: 'matchesField:password',
		message: "The confirmed password must match the password" }],
	'role': ['string', roles.verifyRole]
};

// usable whenever a request is made to create a non-hacker user
function AccreditedUserCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

AccreditedUserCreationRequest.prototype = Object.create(Request.prototype);
AccreditedUserCreationRequest.prototype.constructor = AccreditedUserCreationRequest;

module.exports = AccreditedUserCreationRequest;
