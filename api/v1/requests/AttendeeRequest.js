var Request = require('./Request');
var validators = require('../utils/validators');
var registration = require('../utils/registration');

var attendeeValidations = {
	firstName: ['required', 'string', 'maxLength:255'],
	lastName:  ['required', 'string', 'maxLength:255'],
	shirtSize: ['required', 'string', registration.verifyTshirtSize],
	diet:       ['required', 'string', registration.verifyDiet],
	age:       ['required', 'integer', 'min:13', 'max:115'],
	transportation: ['required', 'string', registration.verifyTransportation],
	school:    ['required', 'string', 'maxLength:255'],
	major:     ['required', 'string', 'maxLength:255'],
	gender:    ['required', 'string', registration.verifyGender],
	professionalInterest: ['required', 'string', registration.verifyProfessionalInterest],
	github:    ['required', 'string', 'maxLength:50'],
	interests: ['required', 'string', 'maxLength:255'],
	status:    ['string', registration.verifyStatus],
	isNovice:  ['required', 'boolean'],
	isPrivate: ['required', 'Boolean']
};
var extraInfoValidations = {
	info:       ['string', 'maxLength:255']
};

var projectValidations = {
	name:       ['required', 'string', 'maxLength:100'],
	description:['required', 'string', 'maxLength:255'],
	repo:       ['required', 'string', 'maxLength:150'],
	isSuggestion: ['required', 'boolean']
};

var ecosystemInterestValidations = {
	attendeeId: ['integer'],
	ecosystemId:  ['required', 'integer']
};

var requestedCollaboratorValidations = {
	collaborator: ['required', 'string', 'maxLength:255']
};

var bodyRequired = ['attendee', 'ecointerests'];
var bodyAllowed = ['projects', 'extras', 'collaborators'];
var bodyValidations = {
	'attendee': ['required', 'plainObject', validators.nested(attendeeValidations, 'attendee')],
	'projects': ['array', 'minLength:1', 'maxLength:2', registration.verifyProjectArray, validators.array(validators.nested(projectValidations, 'projects'), 'projects')],
	'ecointerests': ['required', 'array', 'minLength:1', 'maxLength:2', validators.array(validators.nested(ecosystemInterestValidations, 'ecointerests'), 'ecointerests')],
	'extras': ['array', 'minLength:1', 'maxLength:5', validators.array(validators.nested(extraInfoValidations, 'extras'), 'extras')],
	'collaborators': ['array', 'minLength:1', 'maxLength:8', validators.array(validators.nested(requestedCollaboratorValidations, 'collaborators'), 'collaborators')]
};

function AttendeeRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyAllowed = bodyAllowed;
	this.bodyValidations = bodyValidations;
}

AttendeeRequest._attendeeValidations = attendeeValidations;
AttendeeRequest._extraInfoValidations = extraInfoValidations;
AttendeeRequest._projectValidations = projectValidations;
AttendeeRequest._ecosystemInterestValidations = ecosystemInterestValidations;
AttendeeRequest._requestedCollaboratorValidations = requestedCollaboratorValidations;

AttendeeRequest.prototype = Object.create(Request.prototype);
AttendeeRequest.prototype.constructor = AttendeeRequest;

module.exports = AttendeeRequest;
