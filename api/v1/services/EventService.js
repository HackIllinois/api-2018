var _ = require('lodash');

var errors = require('../errors');
var Location = require('../models/Location');
var Event = require('../models/Event');
var EventLocation = require('../models/EventLocation');

module.exports.getAllLocations = function () {
    return Location.fetchAll();
};

module.exports.createLocation = function (params) {
    params.name = params.name.toLowerCase();
    var location = Location.forge({params});

    return Location
        .findByName(params.name)
        .then(function (result) {
            if (!_.isNull(result)) {
                var message = "A location with the given name already exists";
                var source = "name";
                throw new errors.InvalidParameterError(message, source);
            }

            return location.save();
        });
};

module.exports.getAllEvents = function () {
    Event.where('end_time', '>=', Date.now()).fetch({withRelated: ['locations']});
};

module.exports.createEvent = function (params) {
    var event = params.event;
    var locations = params.eventLocations;

    var event = Event.forge({event});

    return Event.findByName(event.name)
        .then(function (result) {
            if (!_.isNull(result)) {
                var message = "An event with the given name already exists";
                var source = "name";
                throw new errors.InvalidParameterError(message, source);
            }

            return event.save();
        })
        .then(function (event) {
            return _Promise.map(locations, function (location) {
                location.eventId = event.get('id');

                return EventLocation.forge(location).save();
            });
        })
        .then(function () {
            return Event.findByName(event.name);
        });
};