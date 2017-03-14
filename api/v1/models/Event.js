var _ = require('lodash');
var time = require('../utils/time');

var Model = require('./Model');
var EventLocation = require('./EventLocation');
var Event = Model.extend({
    tableName: 'events',
    idAttribute: 'id',
    validations: {
        name: ['required', 'string', 'maxLength:255'],
        shortName: ['required', 'string', 'maxLength:25'],
        description: ['required', 'string', 'maxLength:2047'],
        tracking: ['required', 'boolean'],
        startTime: ['required', time.verifyDate],
        endTime: ['required', time.verifyDate]
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
