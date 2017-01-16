var Request = require('./Request');
var rsvp = require('../utils/rsvp');

var bodyRequired = ['attendeeAttendance'];
var bodyValidations = {
    'attendeeAttendance': ['required', 'string', rsvp.verifyAttendanceReply]
};

function RSVPRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyValidations = bodyValidations;
}

RSVPRequest.prototype = Object.create(Request.prototype);
RSVPRequest.prototype.constructor = RSVPRequest;

module.exports = RSVPRequest;
