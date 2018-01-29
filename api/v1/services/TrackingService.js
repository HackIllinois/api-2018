const CheckitError = require('checkit').Error;
const _ = require('lodash');
const _Promise = require('bluebird');

const ctx = require('ctx');
const cache = ctx.cache().instance();
const TrackingItem = require('../models/TrackingEvent');
const errors = require('../errors');
const utils = require('../utils');

const StatsService = require('../services/StatsService');

const TRACKING_NAMESPACE = 'utracking_';
const TRACKED_EVENT = 'trackedEvent';

/**
 * Allows an Admin to post a new tracking event if one is not being trucked
 * @param {Object} attributes the attributes of the event to be tracked
 * @return {Promise} resolving to the event model
 * @throws {InvalidParameterError} when the provided event is already a tracked event
 * @throws {InvalidTrackingStateError} when an active event is already occurring
 */
module.exports.createTrackingEvent = (attributes) => {
  const trackingItem = TrackingItem.forge(attributes);

  return trackingItem
    .validate()
    .catch(CheckitError, utils.errors.handleValidationError)
    .then(() => cache.getAsync(TRACKED_EVENT))
    .then((result) => {
      if (!_.isNil(result)) {
        return cache.ttlAsync(TRACKED_EVENT)
          .then((ttl) => {
            const message = 'An event is currently being tracked. The current event, ' + result +
              ', ends in: ' + utils.time.secondsToHHMMSS(ttl);
            const source = trackingItem.get('name');
            return _Promise.reject(new errors.InvalidTrackingStateError(message, source));
          });
      }

      return trackingItem.save();
    })
    .tap(() => cache.multi()
        .set(TRACKED_EVENT, trackingItem.get('name'))
        .expire(TRACKED_EVENT, trackingItem.get('duration'))
        .execAsync())
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('This event is already being tracked', 'name')
    );
};

/**
 * Allows a Host to determine if an attendee has already participated in a tracked event
 * @param {Object} participantId the id of the user to track
 * @throws {InvalidTrackingStateError} when there is no event being currently tracked
 * @throws {InvalidParameterError} when an attendee has already participated in an event
 */
module.exports.addEventParticipant = (participantId) => {
  
  let currentEvent;
  return cache.getAsync(TRACKED_EVENT)
    .then((result) => {
      if (_.isNil(result)) {
        const message = 'No event is currently being tracked';
        const source = 'EventTracking';
        throw new errors.InvalidTrackingStateError(message, source);
      }

      currentEvent = result;

      StatsService.incrementStat('liveevent', 'events', currentEvent);

      return cache.getAsync(TRACKING_NAMESPACE + participantId);
    })
    .then((result) => {
      if (!_.isNil(result)) {
        const message = 'This attendee has already participated in ' + currentEvent + '!';
        const source = participantId;
        throw new errors.InvalidParameterError(message, source);
      }

      return cache.ttlAsync(TRACKED_EVENT);
    })
    .then((ttl) => cache.multi()
        .set(TRACKING_NAMESPACE + participantId, true)
        .expire(TRACKING_NAMESPACE + participantId, ttl)
        .execAsync())
    .then(() => TrackingItem.query()
        .where('name', currentEvent)
        .increment('count', 1));
};
