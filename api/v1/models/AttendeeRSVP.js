const CheckIt = require('checkit');

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
  return checkit.run(this.attributes);
};

module.exports = AttendeeRSVP;
