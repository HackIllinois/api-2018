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
    var location = Location.forge(params);

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

module.exports.getAllActiveEvents = function () {
    return Event.query(function(qb) {
      qb.whereRaw('end_time > current_time()').andWhereRaw('start_time < current_time()');
    })
    .fetchAll({withRelated: ['locations']});
};

module.exports.createEvent = function (params) {
    var event = params.event;
    var locations = params.eventLocations;

    return Event.findByName(event.name)
        .then(function (result) {
            if (!_.isNull(result)) {
                var message = "An event with the given name already exists";
                var source = "name";
                throw new errors.InvalidParameterError(message, source);
            }

            return null;
        })
        .then(function () {
            return Bookshelf.transaction(function (t) {
                return new Event(event)
                    .save(null, {transacting: t})
                    .tap(function (result) {
                        return _Promise.map(locations, function(location) {
                            location.eventId = result.id;
                            return new EventLocation(location).save(null, {transacting: t});
                        });
                    });
            });
        });
};
