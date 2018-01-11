const Model = require('./Model');
const AttendeeWebsite = Model.extend({
  tableName: 'attendee_os_contributor',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    osContributor: ['required', 'string', 'maxLength:255']
  }
});

AttendeeWebsite.findByAttendeeId = (attendeeId) => AttendeeWebsite.where({
  attendee_id: attendeeId
})
  .fetch();

AttendeeWebsite.findById = (id) => AttendeeWebsite.where({
  id: id
})
  .fetch();

module.exports = AttendeeWebsite;
