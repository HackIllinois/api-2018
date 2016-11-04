var Request = require('./Request');
var validators = require('../utils/validators');
var registration = require('../utils/registration');

var mentorValidations = {
	firstName: ['required', 'string', 'maxLength:255'],
	lastName:  ['required', 'string', 'maxLength:255'],
	shirtSize: ['required', 'string', registration.verifyTshirtSize],
	status: ['string', registration.verifyStatus],
	github:     ['required', 'string', 'maxLength:50'],
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
	'mentor': ['required', 'plainObject', validators.nested(mentorValidations, 'mentor')],
	'ideas': ['required', 'array', 'minLength:1', 'maxLength:5', validators.array(validators.nested(ideaValidations, 'ideas'))]
};

function MentorCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

MentorCreationRequest._mentorValidations = mentorValidations;
MentorCreationRequest._ideaValidations = ideaValidations;

MentorCreationRequest.prototype = Object.create(Request.prototype);
MentorCreationRequest.prototype.constructor = MentorCreationRequest;

module.exports = MentorCreationRequest;
