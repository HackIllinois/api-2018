var Request = require('./Request');

var bodyRequired = [];
var bodyValidations = {
};

function MentorRegistrationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

MentorRegistrationRequest.prototype = Object.create(Request.prototype);
MentorRegistrationRequest.prototype.constructor = MentorRegistrationRequest;

module.exports = MentorRegistrationRequest;
