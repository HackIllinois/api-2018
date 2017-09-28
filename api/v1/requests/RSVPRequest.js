const Request = require('./Request');
const RSVP = require('../models/AttendeeRSVP');

const bodyRequired = [ 'isAttending' ];
const bodyAllowed = [ 'type' ];
const rsvp = new RSVP();
const bodyValidations = {
  'isAttending': ['required', 'boolean'],
  'type': rsvp.validations.type
};

function RSVPRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyAllowed = bodyAllowed;
  this.bodyValidations = bodyValidations;
}

RSVPRequest.prototype = Object.create(Request.prototype);
RSVPRequest.prototype.constructor = RSVPRequest;

module.exports = RSVPRequest;
