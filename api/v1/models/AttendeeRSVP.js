var CheckIt = require('checkit');

var rsvp = require('../utils/rsvp');
var Model = require('./Model');
var AttendeeRSVP = Model.extend({
    tableName: 'attendee_rsvps',
    idAttribute: 'id',
    validations: {
        attendeeId: ['required', 'integer'],
        isAttending: ['required', 'boolean']
    }
});

AttendeeRSVP.findByAttendeeId = function (attendeeId) {
    return AttendeeRSVP.where({ attendee_id: attendeeId }).fetch();
};

AttendeeRSVP.prototype.validate = function () {
    var checkit = CheckIt(this.validations);
    checkit.maybe({type:  ['required', 'string', rsvp.verifyAttendanceReply]}, function(input) {
        return input.isAttending;
    });

    return checkit.run(this.attributes);
};

module.exports = AttendeeRSVP;
