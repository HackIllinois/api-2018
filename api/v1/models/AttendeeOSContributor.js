const Model = require('./Model');
const AttendeeOSContributor = Model.extend({
  tableName: 'attendee_os_contributor',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    osContributor: ['required', 'string', 'maxLength:255']
  }
});

AttendeeOSContributor.findByAttendeeId = (attendeeId) => AttendeeOSContributor.where({
  attendee_id: attendeeId
})
  .fetch();

AttendeeOSContributor.findById = (id) => AttendeeOSContributor.where({
  id: id
})
  .fetch();

module.exports = AttendeeOSContributor;
