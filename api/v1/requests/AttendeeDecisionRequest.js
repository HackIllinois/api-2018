const Request = require('./Request');
const Attendee = require('../models/Attendee');

const bodyRequired = ['priority', 'wave', 'status'];
const attendee = new Attendee();
const bodyValidations = {
  'priority': ['required', 'integer', 'max:10'],
  'wave': attendee.validations.wave.concat([ 'required' ]),
  'status': attendee.validations.status.concat([ 'required' ])
};

function AttendeeDecisionRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

AttendeeDecisionRequest.prototype = Object.create(Request.prototype);
AttendeeDecisionRequest.prototype.constructor = AttendeeDecisionRequest;

module.exports = AttendeeDecisionRequest;
