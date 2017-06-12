const Request = require('./Request');
const rsvp = require('../utils/rsvp');

const bodyRequired = [ 'isAttending' ];
const bodyAllowed = [ 'type' ];
const bodyValidations = {
  'isAttending': ['required', 'boolean'],
  'type': ['string', rsvp.verifyAttendanceReply]
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
