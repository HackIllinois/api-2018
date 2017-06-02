const CheckIt = require('checkit');

const rsvp = require('../utils/rsvp');
const Model = require('./Model');
const AttendeeRSVP = Model.extend({
  tableName: 'attendee_rsvps',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    isAttending: ['required', 'boolean']
  }
});

AttendeeRSVP.findByAttendeeId = function(attendeeId) {
  return AttendeeRSVP.where({
    attendee_id: attendeeId
  })
    .fetch();
};

AttendeeRSVP.prototype.validate = function() {
  const checkit = CheckIt(this.validations);
  checkit.maybe({
    type: ['required', 'string', rsvp.verifyAttendanceReply]
  }, (input) => input.isAttending);

  return checkit.run(this.attributes);
};

module.exports = AttendeeRSVP;
