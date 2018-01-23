const Request = require('./Request');
const Attendee = require('../models/Attendee');
const validators = require('../utils/validators');

const longFormValidations = {
  info: ['string', 'maxLength:16383']
};

const requestedCollaboratorValidations = {
  collaborator: ['required', 'string', 'maxLength:255']
};

const extraInfoValidations = {
  info: ['string', 'maxLength:255']
};

const osContributorValidations = {
  osContributor: ['string', 'maxLength:255']
};

const bodyRequired = ['attendee.firstName', 'attendee.lastName', 'attendee.shirtSize', 'attendee.diet', 'attendee.age', 'attendee.graduationYear', 'attendee.transportation', 'attendee.school', 'attendee.major', 'attendee.gender', 'attendee.professionalInterest', 'attendee.github', 'attendee.linkedin', 'attendee.isNovice', 'attendee.isPrivate', 'osContributors'];
const bodyAllowed = ['attendee.interests', 'attendee.hasLightningInterest', 'attendee.phoneNumber', 'longForm', 'extraInfo', 'collaborators'];
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
  'longForm': ['array', 'maxLength:1', validators.array(validators.nested(longFormValidations, 'longForm'), 'longForm')],
  'collaborators': ['array', 'maxLength:8', validators.array(validators.nested(requestedCollaboratorValidations, 'collaborators'))],
  'extraInfo': ['array', 'maxLength:2', validators.array(validators.nested(extraInfoValidations, 'extraInfo'), 'extraInfo')],
  'oscontributors': ['array', 'maxLength:8', validators.array(validators.nested(osContributorValidations, 'osContributors'), 'osContributors')]
};

function AttendeeRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyAllowed = bodyAllowed;
  this.bodyValidations = bodyValidations;
}

AttendeeRequest._longFormValidations = longFormValidations;
AttendeeRequest._requestedCollaboratorValidations = requestedCollaboratorValidations;
AttendeeRequest._extraInfoValidations = extraInfoValidations;
AttendeeRequest._osContributorValidations = osContributorValidations;


AttendeeRequest.prototype = Object.create(Request.prototype);
AttendeeRequest.prototype.constructor = AttendeeRequest;

module.exports = AttendeeRequest;
