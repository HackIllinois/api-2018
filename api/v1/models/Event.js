var _ = require('lodash');
var events = require('../utils/events');

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
        startTime: ['required', 'date'],
        endTime: ['required', 'date'],
        tag: ['required', 'string', events.verifyTag]
    },
    locations: function () {
        return this.hasMany(EventLocation);
    }
});

/**
 * Finds an attendee by its ID, joining in its related project ideas
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
Event.prototype.findById = function (id) {
    return Event.where({ id: id }).fetch({withRelated: ['locations']});
};

Event.prototype.findByName = function (name) {
    return Event.where({ name: name }).fetch({withRelated: ['locations']});
};

module.exports = Event;
