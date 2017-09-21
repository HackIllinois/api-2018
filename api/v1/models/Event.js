const Model = require('./Model');
const validators = require('../utils/validators');

const TAGS = ['PRE_EVENT', 'POST_EVENT'];
const EventLocation = require('./EventLocation');
const Event = Model.extend({
  tableName: 'events',
  idAttribute: 'id',
  validations: {
    name: ['required', 'string', 'maxLength:255'],
    description: ['required', 'string', 'maxLength:2047'],
    startTime: ['required', validators.date],
    endTime: ['required', validators.date],
    tag: ['required', 'string', validators.in(TAGS)]
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
