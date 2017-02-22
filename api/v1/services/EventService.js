var _ = require('lodash');
var _Promise = require('bluebird');

var Bookshelf = require('../../database').instance();
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

    return Bookshelf.transaction(function (t) {
        return Event.findByName(event.name)
            .then(function (result) {
                if (!_.isNull(result)) {
                    var message = "An event with the given name already exists";
                    var source = "name";
                    throw new errors.InvalidParameterError(message, source);
                }

                var event = Event.forge({event});
                return event.save(null, {transacting: t});
            })
            .tap(function (result) {
                return _Promise.map(locations, function(location) {
                   return new EventLocation(location).save({'event_id':result.id}, {transacting: t});
                });
            });
    });

};