const _Promise = require('bluebird');
const _ = require('lodash');

const utils = require('../utils');
const Location = require('../models/Location');
const Event = require('../models/Event');
const EventLocation = require('../models/EventLocation');
const EventFavorite = require('../models/EventFavorite');

const errors = require('../errors');

const cache = utils.cache;

const EVENT_FAVORITES_CACHE_KEY = 'eventfavorites';

module.exports.getAllLocations = () => Location.fetchAll();

module.exports.createLocation = (params) => {
  const location = Location.forge(params);

  return location.save()
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('A location with the given name already exists', 'name')
    );
};

module.exports.getEvents = (getActive) => {
  if (getActive) {
    return Event.query((qb) => {
      qb.whereRaw('end_time > current_time()')
          .andWhereRaw('start_time < current_time()');
    })
      .fetchAll({
        withRelated: [ 'locations' ]
      });
  }
  return Event.fetchAll({
    withRelated: [ 'locations' ]
  });

};

module.exports.createEvent = (params) => {
  const event = params.event;
  event.startTime = utils.time.convertISOTimeToMySQLTime(event.startTime);
  event.endTime = utils.time.convertISOTimeToMySQLTime(event.endTime);
  const locations = params.eventLocations;

  return Event.transaction((t) => new Event(event)
      .save(null, {
        transacting: t
      })
      .then((result) => {
        if (locations) {
          return _Promise.map(locations, (location) => {
            location.eventId = result.id;
            return new EventLocation(location)
                .save(null, {
                  transacting: t
                });
          })
            .then((locationResult) => ({
              'event': result,
              'eventLocations': locationResult
            }));
        }
        return {
          'event': result
        };

      }))
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('An event with the given name already exists', 'name')
    );
};

function _writeToCache(userId) {
  return EventFavorite.findByUserId(userId).then((models) => {
    console.log(models.toJSON());
    return cache.storeString(EVENT_FAVORITES_CACHE_KEY + userId, JSON.stringify(models.toJSON()));
  })
}

module.exports.createEventFavorite = (userId, params) => {
  params.userId = userId;
  const eventFavorite = EventFavorite.forge(params);

  return eventFavorite.save()
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('A event favorite with the given event id already exists', 'eventId')
    )
    .catch((error) => error.code === 'ER_NO_REFERENCED_ROW_2', () => {
      const message = 'An event with the given event id does not exist';
      const source = 'eventId';
      throw new errors.InvalidParameterError(message, source);
    })
    .then((model) => {
      return _writeToCache(userId).then(() => {
        return model;
      });
    });
};

module.exports.getEventFavorites = (userId) => {
  return cache.hasKey(EVENT_FAVORITES_CACHE_KEY + userId).then((hasKey) => {
    if(hasKey) {
      return cache.getString(EVENT_FAVORITES_CACHE_KEY + userId)
          .then((object) => JSON.parse(object));
    } else {
      return EventFavorite.findByUserId(userId).then((models) => {
        return _writeToCache(userId).then(() => {
          return models.toJSON();
        });
      });
    }
  })
};

module.exports.deleteEventFavorite = (userId, params) => EventFavorite.findByUserFavoriteEvent(userId, params.eventId)
    .then((model) => {
      if(_.isNull(model)) {
        const message = 'An event favorite with the given event id does not exist';
        const source = 'eventId';
        throw new errors.InvalidParameterError(message, source);
      }
      return model.destroy().then((model) => {
        return _writeToCache(userId).then(() => {
          return model;
        });
      });
    });
