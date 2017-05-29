var Request = require('./Request');
var rsvp = require('../utils/rsvp');

var bodyRequired = ['isAttending'];
var bodyAllowed = ['type'];
var bodyValidations = {
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
