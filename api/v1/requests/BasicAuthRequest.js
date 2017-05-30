const Request = require('./Request');

const bodyRequired = ['email', 'password'];
const bodyValidations = {
	'email': ['required', 'email'],
	'password': ['required', 'string', 'minLength:8', 'maxLength:50']
};

function BasicAuthRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

BasicAuthRequest.prototype = Object.create(Request.prototype);
BasicAuthRequest.prototype.constructor = BasicAuthRequest;

module.exports = BasicAuthRequest;
