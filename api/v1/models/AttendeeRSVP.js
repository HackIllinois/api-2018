const CheckIt = require('checkit');
const validators = require('../utils/validators');

const ATTENDANCE_TYPES = ['CREATE', 'CONTRIBUTE'];

const Model = require('./Model');
const AttendeeRSVP = Model.extend({
  tableName: 'attendee_rsvps',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    isAttending: ['required', 'boolean'],
    type: ['string', validators.in(ATTENDANCE_TYPES)]
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
    type: ['required', 'string', validators.in(ATTENDANCE_TYPES)]
  }, (input) => input.isAttending);

  return checkit.run(this.attributes);
};

module.exports = AttendeeRSVP;
