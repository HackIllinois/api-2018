var _ = require('lodash');

var rsvp = require('../utils/rsvp')
var Model = require('./Model');
var AttendeeRSVP = Model.extend({
    tableName: 'attendee_responses',
    idAttribute: 'id',
    validations: {
        attendeeId: ['required', 'integer'],
        attendeeResponse:  ['required', 'string', rsvp.verifyResponse]
    }
});

AttendeeRSVP.findByAttendeeId = function (attendeeId) {
    return AttendeeRSVP.where({ attendee_id: attendeeId }).fetch();
};

AttendeeRSVP.findById = function (id) {
    return AttendeeRSVP.where({ id: id }).fetch();
};

module.exports = AttendeeRSVP;
