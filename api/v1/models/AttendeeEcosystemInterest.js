var _ = require('lodash');
var registration = require('../utils/registration');


var Model = require('./Model');
var AttendeeEcosystemInterest = Model.extend({
    tableName: 'attendee_ecosystem_interests',
    idAttribute: 'id',
    validations: {
        attendeeId: ['required', 'integer'],
        ecosystemId:  ['required', 'integer']
    }
});

AttendeeEcosystemInterest.findByAttendeeId = function (attendeeId) {
    return AttendeeEcosystemInterest.where({ attendee_id: attendeeId }).fetch();
};

AttendeeEcosystemInterest.findById = function (id) {
    return AttendeeEcosystemInterest.where({ id: id }).fetch();
};

module.exports = AttendeeEcosystemInterest;
