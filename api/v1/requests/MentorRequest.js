const Request = require('./Request');
const Mentor = require('../models/Mentor');
const validators = require('../utils/validators');

const mentor = new Mentor();
const mentorValidations = mentor.validations;
delete mentorValidations['userId'];

const ideaValidations = {
  link: ['required', 'url', 'maxLength:255'],
  contributions: ['required', 'string', 'maxLength:255'],
  ideas: ['required', 'string', 'maxLength:255']
};
const bodyRequired = ['mentor', 'ideas'];
const bodyValidations = {
  'mentor': ['required', 'plainObject', validators.nested(mentor.validations, 'mentor')],
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
