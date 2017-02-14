var CheckitError = require('checkit').Error;
var _ = require('lodash');
var _Promise = require('bluebird');
var ms = require('ms');

var cache = require('../../cache').instance();
var TrackingItem = require('../models/UniversalTrackingItem');
var errors = require('../errors');
var utils = require('../utils');

const TrackingFooter = "UniversalTracking";

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

            return cache.getAsync('trackedEvent')
        })
        .then(function (result) {
            if(!_.isNil(result)) {
                return cache.ttlAsync('trackedEvent')
                    .then(function (ttl) {
                        var message = result + " is already being tracked at this time, time left: " + ttl.toHMS();
                        var source = trackingItem.get('name');
                        return _Promise.reject(new errors.InvalidTrackingStateError(message, source));
                    });
            }

            return cache.multi()
                .set('trackedEvent', trackingItem.get('name'))
                .expire('trackedEvent', trackingItem.get('duration'))
                .execAsync()
                .then(function () {
                    return trackingItem.save();
                });;
        })
};

module.exports.addEventParticipant = function(participantId) {
    return cache.getAsync('trackedEvent')
        .then(function (currentEvent) {
            if(_.isNil(currentEvent)) {
                var message = "No event is currently being tracked";
                var source = "EventTracking";
                throw new errors.InvalidTrackingStateError(message, source);
            }

            return cache.getAsync(participantId + TrackingFooter)
                .then(function (result) {
                    if(!_.isNil(result)) {
                        var message = 'This attendee has already participated in ' + currentEvent + '!';
                        var source = participantId;
                        return _Promise.reject(new errors.InvalidParameterError(message, source));
                    }

                    return _Promise.resolve(currentEvent);
                });
        })
        .then(function (currentTrackedEvent) {
           return cache.ttlAsync('trackedEvent')
                .then(function (ttl) {
                    return cache.multi()
                        .set(participantId + TrackingFooter, true)
                        .expire(participantId + TrackingFooter, ttl)
                        .execAsync()
                        .then(function () {
                            return TrackingItem.query().where('name', currentTrackedEvent).increment('count',1);
                        });
                });
        });
};

Number.prototype.toHMS = function() {
    d = this;
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}