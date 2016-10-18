var Request = require('./Request');
var MentorCreationRequest = require('./MentorCreationRequest');
var validators = require('../utils/validators');

var bodyRequired = ['mentor'];
var bodyValidations = {
	'mentor': ['required', 'plainObject', validators.nested(MentorCreationRequest._mentorValidations, 'mentor')],
	'ideas': ['array', 'maxLength:5', validators.array(validators.nested(MentorCreationRequest._ideaValidations, 'ideas'))]
};

function MentorUpdateRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

MentorUpdateRequest.prototype = Object.create(Request.prototype);
MentorUpdateRequest.prototype.constructor = MentorUpdateRequest;

module.exports = MentorUpdateRequest;
