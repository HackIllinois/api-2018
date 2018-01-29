const _Promise = require('bluebird');
const _ = require('lodash');

const ctx = require('ctx');
const database = ctx.database();
const knex = database.connection();

const Stat = require('../models/Stat');
const Attendee = require('../models/Attendee');
const AttendeeRSVP = require('../models/AttendeeRSVP');
const CheckIn = require('../models/CheckIn');
const TrackedEvent = require('../models/TrackingEvent');

const utils = require('../utils');
const cache = utils.cache;

const STATS_CACHE_KEY = 'stats';
const STATS_LIVE_HEADER = 'liveevent';
const STATS_RSVP_HEADER = 'rsvp';
const STATS_REG_HEADER = 'registration';

module.exports.createStat = function (category, stat, field) {
  return Stat.create(category, stat, field);
};

module.exports.statExists = function (category, stat, field) {
  return Stat.exists(category, stat, field);
};

module.exports.find = function (category, stat, field) {
  return Stat.where({
    category: category,
    stat: stat,
    field: field
  });
};

function _findAll(category, stat) {
  return Stat.where({
    category: category,
    stat: stat
  }).fetchAll();
};

module.exports.findAll = _findAll;

module.exports.incrementStat = function (category, stat, field) {
  cache.hasKey(STATS_CACHE_KEY).then((hasKey) => {
    if (!hasKey) {
      _resetCachedStat().then(() => _incrementCachedStat(category, stat, field));
    } else {
      _incrementCachedStat(category, stat, field);
    }
  });
  return Stat.increment(category, stat, field);
};

function _resetCachedStat() {
  stats = {};
  stats['registration'] = {};
  stats['registration']['school'] = {};
  stats['registration']['transportation'] = {};
  stats['registration']['diet'] = {};
  stats['registration']['shirtSize'] = {};
  stats['registration']['gender'] = {};
  stats['registration']['graduationYear'] = {};
  stats['registration']['isNovice'] = {};
  stats['registration']['status'] = {};
  stats['registration']['major'] = {};
  stats['registration']['attendees'] = {};
  stats['rsvp'] = {};
  stats['rsvp']['school'] = {};
  stats['rsvp']['transportation'] = {};
  stats['rsvp']['diet'] = {};
  stats['rsvp']['shirtSize'] = {};
  stats['rsvp']['gender'] = {};
  stats['rsvp']['graduationYear'] = {};
  stats['rsvp']['isNovice'] = {};
  stats['rsvp']['major'] = {};
  stats['rsvp']['attendees'] = {};
  stats['liveevent'] = {};
  stats['liveevent']['attendees'] = {};
  return cache.storeString(STATS_CACHE_KEY, JSON.stringify(stats));
}

function _incrementCachedStat(category, stat, field) {
  cache.getString(STATS_CACHE_KEY).then((object) => JSON.parse(object)).then((stats) => {
    if(stats[category] == null) {
      stats[category] = {};
    }
    if(stats[category][stat] == null) {
      stats[category][stat] = {};
    }
    if(stats[category][stat][field] == null) {
      stats[category][stat][field] = 0;
    }
    stats[category][stat][field] += 1;
    return cache.storeString(STATS_CACHE_KEY, JSON.stringify(stats));
  });
}

function _readStatsFromDatabase() {
  _resetCachedStat().then(() => {
    cache.getString(STATS_CACHE_KEY).then((object) => JSON.parse(object)).then((stats) => {

      const queries = [];
      
      queries.push(_findAll('registration', 'school').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['school'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'transportation').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['transportation'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'diet').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['diet'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'shirt_size').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['shirtSize'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'gender').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['gender'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'graduation_year').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['graduationYear'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'is_novice').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['isNovice'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'status').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['status'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'major').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['major'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('registration', 'attendees').then((collection) => {
        collection.forEach((model) => {
          stats['registration']['attendees'][model.get('field')] = model.get('count');
        });
      }));


      queries.push(_findAll('rsvp', 'school').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['school'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'transportation').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['transportation'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'diet').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['diet'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'shirt_size').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['shirtSize'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'gender').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['gender'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'graduation_year').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['graduationYear'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'is_novice').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['isNovice'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'major').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['major'][model.get('field')] = model.get('count');
        });
      }));

      queries.push(_findAll('rsvp', 'attendees').then((collection) => {
        collection.forEach((model) => {
          stats['rsvp']['attendees'][model.get('field')] = model.get('count');
        });
      }));


      queries.push(_findAll('liveevent', 'attendees').then((collection) => {
        collection.forEach((model) => {
          stats['liveevent']['attendees'][model.get('field')] = model.get('count');
        });
      }));

      return _Promise.all(queries).then(() => {
        return cache.storeString(STATS_CACHE_KEY, JSON.stringify(stats));
      });
    
    });
  });
}

/**
 * Returns a function that takes a query result and populates a stats object
 * @param  {String} key	the key to use to nest the stats
 * @param  {Object} stats	the stats object to be populated
 * @return {Function} The generated function
 */
function _populateStats(key, stats) {
  return function(result) {
    stats[key] = {};
    _.forEach(result.models, (model) => {
      stats[key][model.attributes.name] = model.attributes.count;
    });
  };
}

/**
 * Returns a function that takes a query result and populates a stats object
 * Differs from above in that it doesn't process a collection
 * @param  {String} key	the key to use to map a count result
 * @param  {Object} stats	the stats object to be populated
 * @return {Function} The generated function
 */
function _populateStatsField(key, stats) {
  return function(result) {
    stats[key] = result.attributes.count;
  };
}

function _populateCheckins(cb) {
  return CheckIn.query((qb) => {
    qb.count('id as count');
  })
    .fetch()
    .then(cb);
}


/**
 * Queries Attendee rsvps and performs a callback on the results
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateRSVPs(cb) {
  return AttendeeRSVP.query((qb) => {
    qb.select('is_attending as name')
        .count('is_attending as count')
        .from('attendee_rsvps')
        .groupBy('is_attending');
  })
    .fetchAll()
    .then(cb);
}


/**
 * Queries Attendee rsvp types interests and performs a callback on the results
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateRSVPTypes(cb) {
  return AttendeeRSVP.query((qb) => {
    qb.select('type as name')
        .count('is_attending as count')
        .from('attendee_rsvps')
        .groupBy('type');
  })
    .fetchAll()
    .then(cb);
}

/**
 * Queries an attendee attribute and counts the unique entries
 * @param  {String} attribute the attribute to query for
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateAttendeeAttribute(attribute, cb) {
  return Attendee.query((qb) => {
    qb.select(attribute + ' as name')
        .count(attribute + ' as count')
        .from('attendees')
        .groupBy(attribute);
  })
    .fetchAll()
    .then(cb);
}

/**
 * Queries an (attending) attendee attribute and counts the unique entries
 * Attending is defined as a ACCEPTED status and is_attending RSVP
 * @param  {String} attribute the attribute to query for
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateAttendingAttendeeAttribute(attribute, cb) {
  return Attendee.query((qb) => {
    qb.select(attribute + ' as name')
        .count(attribute + ' as count')
        .innerJoin('attendee_rsvps as ar', function() {
          this.on('attendees.status', '=', knex.raw('?', [ 'ACCEPTED' ]))
            .andOn('ar.is_attending', '=', knex.raw('?', [ '1' ]));
        })
        .groupBy(attribute);
  })
    .fetchAll()
    .then(cb);
}

/**
 * Queries the total number of attendees
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateAttendees(cb) {
  return Attendee.query((qb) => {
    qb.count('a.id as attending')
        .from('attendees as a')
        .innerJoin('attendee_rsvps as ar', function() {
          this.on('a.status', '=', knex.raw('?', [ 'ACCEPTED' ]))
            .andOn('ar.is_attending', '=', knex.raw('?', [ '1' ]));
        });
  })
    .fetch()
    .then(cb);
}

/**
 * Queries the current stats for tracked events
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateTrackedEvents(cb) {
  return TrackedEvent.query((qb) => {
    qb.select('name', 'count')
        .groupBy('name');
  })
    .fetchAll()
    .then(cb);
}

/**
 * Fetches the current stats, requerying them if not cached
 * @return {Promise<Object>}	resolving to key-value pairs of stats
 */
module.exports.fetchAllStats = () => {
  const stats = {};
  stats.registrationStats = {};
  stats.rsvpStats = {};
  stats.liveEventStats = {};

  return module.exports.fetchRegistrationStats()
    .then((regstats) => {
      stats.registrationStats = regstats;
      return module.exports.fetchRSVPStats();
    })
    .then((rsvpstats) => {
      stats.rsvpStats = rsvpstats;
      return module.exports.fetchLiveEventStats();
    })
    .then((livestats) => {
      stats.liveEventStats = livestats;
      return stats;
    });
};

module.exports.fetchRegistrationStats = () => cache.hasKey(STATS_REG_HEADER + STATS_CACHE_KEY)
    .then((hasKey) => {
      if (hasKey) {
        return cache.getString(STATS_REG_HEADER + STATS_CACHE_KEY)
          .then((object) => JSON.parse(object));
      }
      const stats = {};
      const queries = [];

      const schoolQuery = _populateAttendeeAttribute('school', _populateStats('school', stats));
      queries.push(schoolQuery);

      const transportationQuery = _populateAttendeeAttribute('transportation', _populateStats('transportation', stats));
      queries.push(transportationQuery);

      const dietQuery = _populateAttendeeAttribute('diet', _populateStats('diet', stats));
      queries.push(dietQuery);

      const shirtSizeQuery = _populateAttendeeAttribute('shirt_size', _populateStats('shirtSize', stats));
      queries.push(shirtSizeQuery);

      const genderQuery = _populateAttendeeAttribute('gender', _populateStats('gender', stats));
      queries.push(genderQuery);

      const graduationYearQuery = _populateAttendeeAttribute('graduation_year', _populateStats('graduationYear', stats));
      queries.push(graduationYearQuery);

      const majorQuery = _populateAttendeeAttribute('major', _populateStats('major', stats));
      queries.push(majorQuery);

      const isNoviceQuery = _populateAttendeeAttribute('is_novice', _populateStats('isNovice', stats));
      queries.push(isNoviceQuery);

      const attendeeQuery = _populateAttendees(_populateStatsField('attendees', stats));
      queries.push(attendeeQuery);

      const statusQuery = _populateAttendeeAttribute('status', _populateStats('status', stats));
      queries.push(statusQuery);

      return _Promise.all(queries)
          .then(() => cache.storeString(STATS_REG_HEADER + STATS_CACHE_KEY, JSON.stringify(stats))
              .then(() => {
                const tenMinutesFromNow = (10 * 60);
                return cache.expireKey(STATS_REG_HEADER + STATS_CACHE_KEY, tenMinutesFromNow)
                  .then(() => stats);
              }));

    });

module.exports.fetchRSVPStats = () => cache.hasKey(STATS_RSVP_HEADER + STATS_CACHE_KEY)
    .then((hasKey) => {
      if (hasKey) {
        return cache.getString(STATS_RSVP_HEADER + STATS_CACHE_KEY)
          .then((object) => JSON.parse(object));
      }
      const stats = {};
      const queries = [];

      const attendingSchoolQuery = _populateAttendingAttendeeAttribute('school', _populateStats('school', stats));
      queries.push(attendingSchoolQuery);

      const attendingTransportationQuery = _populateAttendingAttendeeAttribute('transportation', _populateStats('transportation', stats));
      queries.push(attendingTransportationQuery);

      const attendingDietQuery = _populateAttendingAttendeeAttribute('diet', _populateStats('diet', stats));
      queries.push(attendingDietQuery);

      const attendingShirtSizeQuery = _populateAttendingAttendeeAttribute('shirt_size', _populateStats('shirtSize', stats));
      queries.push(attendingShirtSizeQuery);

      const attendingGenderQuery = _populateAttendingAttendeeAttribute('gender', _populateStats('gender', stats));
      queries.push(attendingGenderQuery);

      const attendingGraduationYearQuery = _populateAttendingAttendeeAttribute('graduation_year', _populateStats('graduationYear', stats));
      queries.push(attendingGraduationYearQuery);

      const attendingMajorQuery = _populateAttendingAttendeeAttribute('major', _populateStats('major', stats));
      queries.push(attendingMajorQuery);

      const attendingIsNoviceQuery = _populateAttendingAttendeeAttribute('is_novice', _populateStats('isNovice', stats));
      queries.push(attendingIsNoviceQuery);

      const RSVPsQuery = _populateRSVPs(_populateStats('rsvps', stats));
      queries.push(RSVPsQuery);

      const RSVPTypesQuery = _populateRSVPTypes(_populateStats('type', stats));
      queries.push(RSVPTypesQuery);

      return _Promise.all(queries)
          .then(() => cache.storeString(STATS_RSVP_HEADER + STATS_CACHE_KEY, JSON.stringify(stats))
              .then(() => {
                const tenMinutesFromNow = (10 * 60);
                return cache.expireKey(STATS_RSVP_HEADER + STATS_CACHE_KEY, tenMinutesFromNow)
                  .then(() => stats);
              }));

    });

module.exports.fetchLiveEventStats = () => cache.hasKey(STATS_LIVE_HEADER + STATS_CACHE_KEY)
    .then((hasKey) => {
      if (hasKey) {
        return cache.getString(STATS_LIVE_HEADER + STATS_CACHE_KEY)
          .then((object) => JSON.parse(object));
      }
      const stats = {};
      const queries = [];

      const checkIns = _populateCheckins(_populateStatsField('checkins', stats));
      queries.push(checkIns);

      const trackedEventQuery = _populateTrackedEvents(_populateStats('trackedEvents', stats));
      queries.push(trackedEventQuery);

      return _Promise.all(queries)
          .then(() => cache.storeString(STATS_LIVE_HEADER + STATS_CACHE_KEY, JSON.stringify(stats))
              .then(() => {
                const oneMinuteFromNow = 60;
                return cache.expireKey(STATS_LIVE_HEADER + STATS_CACHE_KEY, oneMinuteFromNow)
                  .then(() => stats);
              }));

    });

module.exports.testStats = function() {
  _readStatsFromDatabase();
};