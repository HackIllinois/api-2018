var CheckitError = require('checkit').Error;
var _ = require('lodash');
var _Promise = require('bluebird');
var ms = require('ms');

var cache = require('../../cache').instance();
var TrackingItem = require('../models/TrackingEvent');
var errors = require('../errors');
var utils = require('../utils');

const TrackingNamespace = "utracking_";
const TrackedEvent = "trackedEvent";

module.exports.createTrackingEvent = function (attributes) {
    var trackingItem = TrackingItem.forge(attributes);

    return trackingItem
        .validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function (validated) {
            return TrackingItem.findByName(attributes.name);
        })
        .then(function (result) {
            if (!_.isNull(result)) {
                var message = "This event is already being tracked";
                var source = "name";
                throw new errors.InvalidParameterError(message, source);
            }

            return cache.getAsync(TrackedEvent)
        })
        .then(function (result) {
            if(!_.isNil(result)) {
                return cache.ttlAsync(TrackedEvent)
                    .then(function (ttl) {
                        var message = "An event is currently being tracked. The current event, " + result
                            + " ends in: " + utils.time.secondsToHHMMSS(ttl);
                        var source = trackingItem.get('name');
                        return _Promise.reject(new errors.InvalidTrackingStateError(message, source));
                    });
            }

            return cache.multi()
                .set(TrackedEvent, trackingItem.get('name'))
                .expire(TrackedEvent, trackingItem.get('duration'))
                .execAsync()
                .then(function () {
                    return trackingItem.save();
                });;
        })
};

module.exports.addEventParticipant = function(participantId) {
    return cache.getAsync(TrackedEvent)
        .then(function (currentEvent) {
            if(_.isNil(currentEvent)) {
                var message = "No event is currently being tracked";
                var source = "EventTracking";
                throw new errors.InvalidTrackingStateError(message, source);
            }

            return cache.getAsync(TrackingNamespace + participantId)
                .then(function (result) {
                    if(!_.isNil(result)) {
                        var message = 'This attendee has already participated in ' + currentEvent + '!';
                        var source = participantId;
                        return _Promise.reject(new errors.InvalidParameterError(message, source));
                    }

                    return currentEvent;
                });
        })
        .then(function (currentTrackedEvent) {
           return cache.ttlAsync(TrackedEvent)
                .then(function (ttl) {
                    return cache.multi()
                        .set(TrackingNamespace + participantId, true)
                        .expire(TrackingNamespace + participantId, ttl)
                        .execAsync()
                        .then(function () {
                            TrackingItem.query().where('name', currentTrackedEvent).increment('count',1);
                            return;
                        });
                });
        });
};