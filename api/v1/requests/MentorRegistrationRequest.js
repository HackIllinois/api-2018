var Request = require('./Request');
var validator = require('../utils/validator');
var registration = require('../utils/registration');


var mentorValidations = {
	first_name: ['required', 'string', 'maxLength:255'],
	last_name:  ['required', 'string', 'maxLength:255'],
	shirt_size: ['required', 'string', registration.verifyTshirtSize],
	github:     ['string', 'maxLength:50'],
	location:    ['required', 'string', 'maxLength:255'],
	summary:    ['required', 'string', 'maxLength:255'],
	occupation: ['required', 'string', 'maxLength:255'],
};
var ideaValidations = {
    link:           ['required', 'url', 'maxLength:255'],
    contributions:  ['required', 'string', 'maxLength:255'],
    ideas:          ['required', 'string', 'maxLength:255']
};
var bodyRequired = ['mentor', 'ideas'];
var bodyValidations = {
	'mentor': ['object', validator.nestedValidator(mentorValidations)],
	'ideas': ['array', validator.arrayValidator(validator.nestedValidator(ideaValidations))]
};

function MentorRegistrationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

MentorRegistrationRequest.prototype = Object.create(Request.prototype);
MentorRegistrationRequest.prototype.constructor = MentorRegistrationRequest;

module.exports = MentorRegistrationRequest;
