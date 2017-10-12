const _Promise = require('bluebird');
const _ = require('lodash');



const Attendee = require('../models/Attendee');
const AttendeeRSVP = require('../models/AttendeeRSVP');
const CheckIn = require('../models/CheckIn');
const AttendeeEcosystemInterest = require('../models/AttendeeEcosystemInterest');
const TrackedEvent = require('../models/TrackingEvent');

const utils = require('../utils');
const cache = utils.cache;

const STATS_CACHE_KEY = 'stats';
const STATS_LIVE_HEADER = 'liveevent';
const STATS_RSVP_HEADER = 'rsvp';
const STATS_REG_HEADER = 'registration';

function StatsService(ctx) {

    let database = ctx.database();
    let knex = database.connection();

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

    /**
     * Queries Attendee ecosystems interests and performs a callback on the results
     * @param  {Function} cb the function to process the query results with
     * @return {Promise} resolving to the return value of the callback
     */
    function _populateEcosystems(cb) {
      return AttendeeEcosystemInterest.query((qb) => {
        qb.select('e.name')
            .count('ecosystem_id as count')
            .from('attendee_ecosystem_interests as aei')
            .innerJoin('ecosystems as e', 'e.id', 'aei.ecosystem_id')
            .groupBy('aei.ecosystem_id');
      })
        .fetchAll()
        .then(cb);
    }

    /**
     * Queries (attending) Attendee ecosystems interests and performs a callback on the results
     * Attending is defined as a ACCEPTED status and is_attending RSVP
     * @param  {Function} cb the function to process the query results with
     * @return {Promise} resolving to the return value of the callback
     */
    function _populateAttendingEcosystems(cb) {
      return Attendee.query((qb) => {
        qb.select('e.name')
            .count('a.accepted_ecosystem_id as count')
            .from('attendees as a')
            .innerJoin('ecosystems as e', function() {
              this.on('e.id', '=', 'a.accepted_ecosystem_id')
                .andOn('a.status', '=', knex.raw('?', [ 'ACCEPTED' ]));
            })
            .innerJoin('attendee_rsvps as ar', function() {
              this.on('ar.attendee_id', '=', 'a.id')
                .andOn('ar.is_attending', '=', knex.raw('?', [ '1' ]))
                .andOn('ar.type', '=', knex.raw('?', [ 'CONTRIBUTE' ]));
            })
            .groupBy('a.accepted_ecosystem_id');
      })
        .fetchAll()
        .then(cb);
    }

    function _populateCheckedInEcosystems(cb) {
      return Attendee.query((qb) => {
        qb.select('e.name')
            .count('a.accepted_ecosystem_id as count')
            .from('attendees as a')
            .innerJoin('ecosystems as e', function() {
              this.on('e.id', '=', 'a.accepted_ecosystem_id')
                .andOn('a.status', '=', knex.raw('?', [ 'ACCEPTED' ]));
            })
            .innerJoin('attendee_rsvps as ar', function() {
              this.on('ar.attendee_id', '=', 'a.id')
                .andOn('ar.is_attending', '=', knex.raw('?', [ '1' ]))
                .andOn('ar.type', '=', knex.raw('?', [ 'CONTRIBUTE' ]));
            })
            .innerJoin('checkins as ci', 'a.user_id', 'ci.user_id')
            .groupBy('a.accepted_ecosystem_id');
      })
        .fetchAll()
        .then(cb);
    }

    function _populateCheckins(cb) {
      return CheckIn.query((qb) => {
        qb.count('id as count');
      })
        .fetch()
        .then(cb);
    }


    /**
     * Queries Attendee ecosystems interests and performs a callback on the results
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
     * Queries Attendee ecosystems interests and performs a callback on the results
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
    this.fetchAllStats = () => {
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

    this.fetchRegistrationStats = () => cache.hasKey(STATS_REG_HEADER + STATS_CACHE_KEY)
        .then((hasKey) => {
          if (hasKey) {
            return cache.getString(STATS_REG_HEADER + STATS_CACHE_KEY)
              .then((object) => JSON.parse(object));
          }
          const stats = {};
          const queries = [];

          const ecosystemsQuery = _populateEcosystems(_populateStats('ecosystems', stats));
          queries.push(ecosystemsQuery);

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

    this.fetchRSVPStats = () => cache.hasKey(STATS_RSVP_HEADER + STATS_CACHE_KEY)
        .then((hasKey) => {
          if (hasKey) {
            return cache.getString(STATS_RSVP_HEADER + STATS_CACHE_KEY)
              .then((object) => JSON.parse(object));
          }
          const stats = {};
          const queries = [];

          const attendingEcosystemsQuery = _populateAttendingEcosystems(_populateStats('ecosystems', stats));
          queries.push(attendingEcosystemsQuery);

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

    this.fetchLiveEventStats = () => cache.hasKey(STATS_LIVE_HEADER + STATS_CACHE_KEY)
        .then((hasKey) => {
          if (hasKey) {
            return cache.getString(STATS_LIVE_HEADER + STATS_CACHE_KEY)
              .then((object) => JSON.parse(object));
          }
          const stats = {};
          const queries = [];

          const checkIns = _populateCheckins(_populateStatsField('checkins', stats));
          queries.push(checkIns);

          const checkedInEcosystemsQuery = _populateCheckedInEcosystems(_populateStats('ecosystems', stats));
          queries.push(checkedInEcosystemsQuery);

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
}

StatsService.prototype.constructor = StatsService;

module.exports = function(ctx) {
    return new StatsService(ctx);
}
