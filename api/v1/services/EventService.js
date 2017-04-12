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

    return location.save()
    .catch((err) => err.code === errors.Constants.DupEntry, function (err) {
				var message = "An ecosystem with the given name already exists";
				var source = "name";
				throw new errors.InvalidParameterError(message, source);
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

    return Bookshelf.transaction(function (t) {
      return new Event(event)
          .save(null, {transacting: t})
          .then(function (result) {
              return _Promise.map(locations, function(location) {
                  location.eventId = result.id;
                  return new EventLocation(location).save(null, {transacting: t});
              })
              .then(function (locationResult) {
                return {
                    "event": result,
                    "eventLocations": locationResult
                };
              });
          });
    })
    .catch((err) => err.code === errors.Constants.DupEntry, function (err) {
        var message = "An event with the given name already exists";
        var source = "name";
        throw new errors.InvalidParameterError(message, source);
  	});
};
