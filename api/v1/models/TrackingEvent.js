const Model = require('./Model');

const TrackingEvent = Model.extend({
  tableName: 'tracking_events',
  idAttribute: 'id',
  hasTimestamps: [ 'created' ],
  validations: {
    name: ['required', 'string', 'maxLength:255'],
    duration: ['required', 'naturalNonZero']
  }
});

TrackingEvent.findByName = function(searchName) {
  return TrackingEvent.where({
    name: searchName
  })
    .fetch();
};

TrackingEvent.findAll = function() {
  return TrackingEvent.where({

  }).fetchAll();
};

module.exports = TrackingEvent;
