const Request = require('./Request');
const Attendee = require('../models/Attendee');

const bodyRequired = ['priority', 'wave', 'status'];
const bodyAllowed = [ 'acceptedEcosystemId' ];
const attendee = new Attendee();
const bodyValidations = {
  'priority': ['required', 'integer', 'max:10'],
  'wave': attendee.validations.wave.concat([ 'required' ]),
  'status': attendee.validations.status.concat([ 'required' ]),
  'acceptedEcosystemId': [ 'integer' ]
};

function AttendeeDecisionRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
  this.bodyAllowed = bodyAllowed;
}

AttendeeDecisionRequest.prototype = Object.create(Request.prototype);
AttendeeDecisionRequest.prototype.constructor = AttendeeDecisionRequest;

module.exports = AttendeeDecisionRequest;
