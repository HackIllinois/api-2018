const Model = require('./Model');
const AttendeeWebsite = Model.extend({
  tableName: 'attendee_websites',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    website: ['required', 'string', 'maxLength:255']
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
