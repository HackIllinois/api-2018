const Model = require('./Model');

const EventFavorite = Model.extend({
  tableName: 'event_favorites',
  idAttribute: 'id',
  validations: {
    userId: ['required', 'integer'],
    eventId: ['required', 'integer']
  }
});

EventFavorite.findById = function(id) {
  return EventFavorite.where({
    id: id
  })
    .fetch();
};

EventFavorite.findByUserId = function(user_id) {
  return EventFavorite.where({
    user_id: user_id
  })
    .fetchAll();
};

EventFavorite.findByUserAndEventId = function(user_id, event_id) {
  return EventFavorite.where({
    user_id: user_id,
    event_id: event_id
  })
    .fetch();
};

module.exports = EventFavorite;
