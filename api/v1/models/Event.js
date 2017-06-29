const time = require('../utils/time');
const events = require('../utils/events');

const Model = require('./Model');
const EventLocation = require('./EventLocation');
const Event = Model.extend({
  tableName: 'events',
  idAttribute: 'id',
  validations: {
    name: ['required', 'string', 'maxLength:255'],
    description: ['required', 'string', 'maxLength:2047'],
    startTime: ['required', time.verifyDate],
    endTime: ['required', time.verifyDate],
    tag: ['required', 'string', events.verifyTag]
  },
  locations: function() {
    return this.hasMany(EventLocation);
  }
});

Event.findById = function(id) {
  return Event.where({
    id: id
  })
    .fetch({
      withRelated: [ 'locations' ]
    });
};

Event.findByName = function(name) {
  return Event.where({
    name: name
  })
    .fetch({
      withRelated: [ 'locations' ]
    });
};

module.exports = Event;
