const roles = require('../utils/roles');
const Request = require('./Request');

const bodyRequired = ['email', 'role'];
const bodyValidations = {
	'email': ['email'],
	'role': ['string', roles.verifyRole]
};

function AccreditedUserCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

AccreditedUserCreationRequest.prototype = Object.create(Request.prototype);
AccreditedUserCreationRequest.prototype.constructor = AccreditedUserCreationRequest;

module.exports = AccreditedUserCreationRequest;
