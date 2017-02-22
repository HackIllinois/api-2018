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

/**
 * Allows an Admin to post a new tracking event if one is not being trucked
 * @param {Object} attributes the attributes of the event to be tracked
 * @return {Promise} resolving to the event model
 * @throws {InvalidParameterError} when the provided event is already a tracked event
 * @throws {InvalidTrackingStateError} when an active event is already occurring
 */
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

            return cache.getAsync(TrackedEvent);
        })
        .then(function (result) {
            if(!_.isNil(result)) {
                return cache.ttlAsync(TrackedEvent)
                    .then(function (ttl) {
                        var message = "An event is currently being tracked. The current event, " + result
                            + ", ends in: " + utils.time.secondsToHHMMSS(ttl);
                        var source = trackingItem.get('name');
                        return _Promise.reject(new errors.InvalidTrackingStateError(message, source));
                    });
            }

            return cache.multi()
                .set(TrackedEvent, trackingItem.get('name'))
                .expire(TrackedEvent, trackingItem.get('duration'))
                .execAsync();

        })
        .then(function () {
            return trackingItem.save();
        });
};

/**
 * Allows a Host to determine if an attendee has already participated in a tracked event
 * @param {Object} participantId the id of the user to track
 * @throws {InvalidTrackingStateError} when there is no event being currently tracked
 * @throws {InvalidParameterError} when an attendee has already participated in an event
 */
module.exports.addEventParticipant = function(participantId) {
    var currentEvent;
    return cache.getAsync(TrackedEvent)
        .then(function (result) {
            if(_.isNil(result)) {
                var message = "No event is currently being tracked";
                var source = "EventTracking";
                throw new errors.InvalidTrackingStateError(message, source);
            }

            currentEvent = result;

            return cache.getAsync(TrackingNamespace + participantId);
        })
        .then(function (result) {
            if(!_.isNil(result)) {
                var message = 'This attendee has already participated in ' + currentEvent + '!';
                var source = participantId;
                throw new errors.InvalidParameterError(message, source);
            }

            return cache.ttlAsync(TrackedEvent);
        })
        .then(function (ttl) {
            return cache.multi()
                .set(TrackingNamespace + participantId, true)
                .expire(TrackingNamespace + participantId, ttl)
                .execAsync();
        })
        .then(function () {
            return TrackingItem.query().where('name', currentEvent).increment('count',1);
        });
};