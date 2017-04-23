var _ = require('lodash');
var time = require('../utils/time');
var events = require('../utils/events');

var Model = require('./Model');
var EventLocation = require('./EventLocation');
var Event = Model.extend({
    tableName: 'events',
    idAttribute: 'id',
    validations: {
        name: ['required', 'string', 'maxLength:255'],
        description: ['required', 'string', 'maxLength:2047'],
        startTime: ['required', time.verifyDate],
        endTime: ['required', time.verifyDate],
        tag: ['required', 'string', events.verifyTag]
    },
    locations: function () {
        return this.hasMany(EventLocation);
    }
});

Event.findById = function (id) {
    return Event.where({ id: id }).fetch({withRelated: ['locations']});
};

Event.findByName = function (name) {
    return Event.where({ name: name }).fetch({withRelated: ['locations']});
};

module.exports = Event;
