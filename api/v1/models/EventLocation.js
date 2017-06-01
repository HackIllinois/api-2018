const Model = require('./Model');
const EventLocation = Model.extend({
  tableName: 'event_locations',
  idAttribute: 'id',
  validations: {
    eventId: ['required', 'integer'],
    locationId: ['required', 'integer']
  }
});

EventLocation.eventId = function (eventId) {
  return EventLocation.where({ event_id: eventId }).fetch();
};

module.exports = EventLocation;
