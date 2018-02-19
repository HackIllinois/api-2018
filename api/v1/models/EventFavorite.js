const Model = require('./Model');

const EventFavorite = Model.extend({
  tableName: 'event_favorites',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    eventId: ['required', 'integer']
  }
});

EventFavorite.findById = function(id) {
  return EventFavorite.where({
    id: id
  })
    .fetch();
};

EventFavorite.findByAttendeeId = function(attendee_id) {
  return EventFavorite.where({
    attendee_id: attendee_id
  })
    .fetchAll();
};

EventFavorite.findByAttendeeAndEventId = function(attendee_id, event_id) {
  return EventFavorite.where({
    attendee_id: attendee_id,
    event_id: event_id
  })
    .fetch();
};

module.exports = EventFavorite;
