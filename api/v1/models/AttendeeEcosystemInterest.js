const Model = require('./Model');
const AttendeeEcosystemInterest = Model.extend({
  tableName: 'attendee_ecosystem_interests',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    ecosystemId: ['required', 'integer']
  }
});

AttendeeEcosystemInterest.findByAttendeeId = (attendeeId) => AttendeeEcosystemInterest.where({
  attendee_id: attendeeId
})
		.fetch();

AttendeeEcosystemInterest.findById = (id) => AttendeeEcosystemInterest.where({
  id: id
})
		.fetch();

module.exports = AttendeeEcosystemInterest;
