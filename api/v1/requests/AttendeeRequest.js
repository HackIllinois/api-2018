const Request = require('./Request');
const Attendee = require('../models/Attendee');
const validators = require('../utils/validators');

const extraInfoValidations = {
  info: ['string', 'maxLength:255']
};

const projectErrorMessage = 'The projects supplied are invalid. Attendees can only create 1 project at most.';
const projectValidations = {
  name: ['required', 'string', 'maxLength:100'],
  description: ['required', 'string', 'maxLength:255'],
  repo: ['required', 'string', 'maxLength:150'],
  isSuggestion: ['required', 'boolean']
}; // NOTE: these are currently not supported

const ecosystemInterestValidations = {
  ecosystemId: ['required', 'integer']
};

const requestedCollaboratorValidations = {
  collaborator: ['required', 'string', 'maxLength:255']
};

const websiteValidations = {
  website: ['string', 'maxLength:255']
};

const osContributorValidations = {
  osContributor: ['string', 'maxLength:255']
};

const bodyRequired = [ 'attendee' ];
const bodyAllowed = ['ecosystemInterests', 'projects', 'extras', 'websites', 'osContributors', 'collaborators'];
const attendee = new Attendee();
const bodyValidations = {
  'attendee': ['required', 'plainObject'],
  'attendee.firstName': attendee.validations.firstName,
  'attendee.lastName': attendee.validations.lastName,
  'attendee.shirtSize': attendee.validations.shirtSize,
  'attendee.diet': attendee.validations.diet,
  'attendee.age': attendee.validations.age,
  'attendee.graduationYear': attendee.validations.graduationYear,
  'attendee.transportation': attendee.validations.transportation,
  'attendee.school': attendee.validations.school,
  'attendee.major': attendee.validations.major,
  'attendee.gender': attendee.validations.gender,
  'attendee.professionalInterest': attendee.validations.professionalInterest,
  'attendee.github': attendee.validations.github,
  'attendee.linkedin': attendee.validations.linkedin,
  'attendee.interests': attendee.validations.interests,
  'attendee.isNovice': attendee.validations.isNovice,
  'attendee.isPrivate': attendee.validations.isPrivate,
  'attendee.hasLightningInterest': [ 'boolean' ],
  'attendee.phoneNumber': attendee.validations.phoneNumber,
  'ecosystemInterests': ['array', 'maxLength:4', validators.array(validators.nested(ecosystemInterestValidations, 'ecosystemInterests'))],
  'projects': ['array', 'maxLength:1', validators.upTo(['isSuggestion', false], 1, projectErrorMessage), validators.array(validators.nested(projectValidations, 'projects'))],
  'extras': ['array', 'maxLength:1', validators.array(validators.nested(extraInfoValidations, 'extras'), 'extras')],
  'collaborators': ['array', 'maxLength:8', validators.array(validators.nested(requestedCollaboratorValidations, 'collaborators'))],
  'websites': ['array', 'maxLength:2', validators.array(validators.nested(websiteValidations, 'websites'), 'websites')],
  'oscontributors': ['array', 'maxLength:8', validators.array(validators.nested(osContributorValidations, 'osContributors'), 'osContributors')]
};

function AttendeeRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyAllowed = bodyAllowed;
  this.bodyValidations = bodyValidations;
}

AttendeeRequest._extraInfoValidations = extraInfoValidations;
AttendeeRequest._projectValidations = projectValidations;
AttendeeRequest._ecosystemInterestValidations = ecosystemInterestValidations;
AttendeeRequest._requestedCollaboratorValidations = requestedCollaboratorValidations;
AttendeeRequest._websiteValidations = websiteValidations;
AttendeeRequest._osContributorValidations = osContributorValidations;


AttendeeRequest.prototype = Object.create(Request.prototype);
AttendeeRequest.prototype.constructor = AttendeeRequest;

module.exports = AttendeeRequest;
