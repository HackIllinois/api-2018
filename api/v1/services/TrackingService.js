var _ = require('lodash');

var cache = require('../../cache').instance();
var errors = require('../errors');
var TrackingItem = require('../models/UniversalTrackingItem');

module.exports.getActiveEvents = function () {
    return TrackingItem.query(function (qb) {
        qb.select(['id', 'name', 'count']).where(qb.knex.raw('DATEADD(ss, duration, created)'), '<', Date.now());
    })
    .fetchAll();
};

module.exports.createTrackingEvent = function (attributes) {
    var trackingItem = TrackingItem.forge(attributes);

    return trackingItem
        .validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function () {
            cache.multi()
                .set(trackingItem.get('name'), true)
                .expire(trackingItem.get('name'), trackingItem.get('duration'))
                .exec()
                .catch(function (err) {
                    var message = err;
                    var source = trackingItem.get('name');
                    throw new errors.RedisError(message, source);
                });

            return trackingItem.save();
        })
};

module.exports.addEventParticipant = function(eventName, participantId) {
    return cache.get(eventName)
        .then(function (result) {
            if(_.isNil(result)) {
                var message = 'The eventname is invalid';
                var source = eventName;
                throw new errors.InvalidParameterError(message, source);
            }

            return cache.get(participantId + eventName)
                .then(function (result) {
                    if(!_.isNil(result)) {
                        var message = 'This attendee has already participated in this event!';
                        var source = participantId;
                        throw new errors.InvalidParameterError(message, source);
                    }
                });
        })
        .then(function () {
           return cache.ttl(eventName)
                .then(function (ttl) {
                    return cache.multi()
                        .set(participantId + eventName, true)
                        .expire(participantId + eventName, ttl)
                        .exec()
                        .catch(function (err) {
                            var message = err;
                            var source = eventName;
                            throw new errors.RedisError(message, source);
                        });
                })
               .then(function () {
                   TrackingItem.query().where('name', eventName).increment('count',1);
                   return cache.get(participantId+eventName);
               })
        });
};