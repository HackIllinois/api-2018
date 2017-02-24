var _Promise = require('bluebird');
var _ = require('lodash');

var database = require('../../database');

var Attendee = require('../models/Attendee');
var AttendeeRSVP = require('../models/AttendeeRSVP');
var CheckIn = require('../models/CheckIn');
var AttendeeEcosystemInterest = require('../models/AttendeeEcosystemInterest');
var Ecosystem = require('../models/Ecosystem');
var User = require('../models/User');
var TrackedEvent = require('../models/TrackingEvent');

var errors = require('../errors');
var utils = require('../utils');
var cache = utils.cache;

const STATS_CACHE_KEY = 'stats';
const STATS_LIVE_HEADER = 'liveevent';
const STATS_RSVP_HEADER = 'rsvp';
const STATS_REG_HEADER = 'registration';

/**
 * Returns a function that takes a query result and populates a stats object
 * @param  {String} key	the key to use to nest the stats
 * @param  {Object} stats	the stats object to be populated
 * @return {Function} The generated function
 */
function _populateStats(key, stats){
    return function(result){
        stats[key] = {};
        _.forEach(result.models, function(model){
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
function _populateStatsField(key, stats){
    return function(result){
        stats[key] = result.attributes.count;
    };
}

/**
 * Queries Attendee ecosystems interests and performs a callback on the results
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateEcosystems(cb){
    return AttendeeEcosystemInterest.query(function(qb){
        qb.select('e.name').count('ecosystem_id as count').from('attendee_ecosystem_interests as aei').innerJoin('ecosystems as e', 'e.id', 'aei.ecosystem_id').groupBy('aei.ecosystem_id');
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
function _populateAttendingEcosystems(cb){
    return Attendee.query(function(qb){
        qb.select('e.name').count('accepted_ecosystem_id as count').innerJoin('ecosystems as e', 'e.id', 'accepted_ecosystem_id')
            .whereExists(function() {
                this.select('*').from('attendee_rsvps').whereRaw('attendees.id = attendee_rsvps.attendee_id').andWhere('is_attending', 1).andWhere('type', 'CONTRIBUTE');
            }).groupBy('accepted_ecosystem_id');
    })
    .fetchAll()
    .then(cb);
}

function _populateCheckedInEcosystems(cb){
    return Attendee.query(function(qb){
        qb.select('e.name').count('accepted_ecosystem_id as count').innerJoin('ecosystems as e', 'e.id', 'accepted_ecosystem_id')
            .whereExists(function() {
                this.select('*').from('attendee_rsvps').whereRaw('attendees.id = attendee_rsvps.attendee_id').andWhere('is_attending', 1).andWhere('type', 'CONTRIBUTE')
                    .whereExists(function() {
                        this.select('*').from('checkins').whereRaw('attendees.user_id = checkins.user_id');
                    });
            }).groupBy('accepted_ecosystem_id');
    })
        .fetchAll()
        .then(cb);
}

function _populateCheckins(cb){
    return CheckIn.query(function(qb){
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
function _populateRSVPs(cb){
    return AttendeeRSVP.query(function(qb){
        qb.select('is_attending as name').count('is_attending as count').from('attendee_rsvps').groupBy('is_attending');
    })
    .fetchAll()
    .then(cb);
}


/**
 * Queries Attendee ecosystems interests and performs a callback on the results
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateRSVPTypes(cb){
    return AttendeeRSVP.query(function(qb){
        qb.select('type as name').count('is_attending as count').from('attendee_rsvps').groupBy('type');
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
function _populateAttendeeAttribute(attribute, cb){
    return Attendee.query(function(qb){
        qb.select(attribute + ' as name').count(attribute + ' as count').from('attendees').groupBy(attribute);
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
function _populateAttendingAttendeeAttribute(attribute, cb){
    return Attendee.query(function(qb){
        qb.select(attribute + ' as name').count(attribute + ' as count').where('status', 'ACCEPTED').whereExists(function() {
            this.select('*').from('attendee_rsvps').whereRaw('attendees.id = attendee_rsvps.attendee_id').andWhere('is_attending', 1);
        }).groupBy(attribute);
    })
    .fetchAll()
    .then(cb);
}

/**
 * Queries the total number of attendees
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateAttendees(cb){
    return Attendee.query(function(qb){
    qb.count('id as count');
    })
    .fetch()
    .then(cb);
}

/**
 * Queries the current stats for tracked events
 * @param  {Function} cb the function to process the query results with
 * @return {Promise} resolving to the return value of the callback
 */
function _populateTrackedEvents(cb){
    return TrackedEvent.query(function(qb){
        qb.select('name', 'count').groupBy('name');
    })
        .fetchAll()
        .then(cb);
}

/**
* Fetches the current stats, requerying them if not cached
* @return {Promise<Object>}	resolving to key-value pairs of stats
*/
module.exports.fetchAllStats = function () {
    var stats = {};
    stats.registrationStats = {};
    stats.rsvpStats = {};
    stats.liveEventStats = {};

    return module.exports.fetchRegistrationStats()
        .then(function (regstats) {
            stats.registrationStats = regstats;
            return module.exports.fetchRSVPStats();
        })
        .then(function (rsvpstats) {
            stats.rsvpStats = rsvpstats;
            return module.exports.fetchLiveEventStats();
        })
        .then(function (livestats) {
            stats.liveEventStats = livestats;
            return stats;
        })
};

module.exports.fetchRegistrationStats = function () {
    return cache.hasKey(STATS_REG_HEADER + STATS_CACHE_KEY)
        .then(function(hasKey){
            if(hasKey) {
                return cache.getString(STATS_REG_HEADER + STATS_CACHE_KEY)
                    .then(function(object){
                        return JSON.parse(object);
                    });
            }
            else {
                var stats = {};
                var queries = [];

                var ecosystemsQuery = _populateEcosystems(_populateStats('ecosystems', stats));
                queries.push(ecosystemsQuery);

                var schoolQuery = _populateAttendeeAttribute('school', _populateStats('school', stats));
                queries.push(schoolQuery);

                var transportationQuery = _populateAttendeeAttribute('transportation', _populateStats('transportation', stats));
                queries.push(transportationQuery);

                var dietQuery = _populateAttendeeAttribute('diet', _populateStats('diet', stats));
                queries.push(dietQuery);

                var shirtSizeQuery = _populateAttendeeAttribute('shirt_size', _populateStats('shirtSize', stats));
                queries.push(shirtSizeQuery);

                var genderQuery = _populateAttendeeAttribute('gender', _populateStats('gender', stats));
                queries.push(genderQuery);

                var graduationYearQuery = _populateAttendeeAttribute('graduation_year', _populateStats('graduationYear', stats));
                queries.push(graduationYearQuery);

                var majorQuery =  _populateAttendeeAttribute('major', _populateStats('major', stats));
                queries.push(majorQuery);

                var isNoviceQuery = _populateAttendeeAttribute('is_novice', _populateStats('isNovice', stats));
                queries.push(isNoviceQuery);

                var attendeeQuery =  _populateAttendees(_populateStatsField('attendees', stats));
                queries.push(attendeeQuery);

                var statusQuery = _populateAttendeeAttribute('status', _populateStats('status', stats));
                queries.push(statusQuery);

                return _Promise.all(queries)
                    .then(function(){
                        return cache.storeString(STATS_REG_HEADER + STATS_CACHE_KEY, JSON.stringify(stats))
                            .then(function(){
                                var tenMinutesFromNow = (10*60);
                                return cache.expireKey(STATS_REG_HEADER + STATS_CACHE_KEY, tenMinutesFromNow)
                                    .then(function(){
                                        return stats;
                                    });
                            });
                    });
            }
        });
};

module.exports.fetchRSVPStats = function () {
    return cache.hasKey(STATS_RSVP_HEADER + STATS_CACHE_KEY)
        .then(function(hasKey){
            if(hasKey) {
                return cache.getString(STATS_RSVP_HEADER + STATS_CACHE_KEY)
                    .then(function(object){
                        return JSON.parse(object);
                    });
            }
            else {
                var stats = {};
                var queries = [];

                var attendingEcosystemsQuery = _populateAttendingEcosystems(_populateStats('ecosystems', stats));
                queries.push(attendingEcosystemsQuery);

                var attendingSchoolQuery = _populateAttendingAttendeeAttribute('school', _populateStats('school', stats));
                queries.push(attendingSchoolQuery);

                var attendingTransportationQuery = _populateAttendingAttendeeAttribute('transportation', _populateStats('transportation', stats));
                queries.push(attendingTransportationQuery);

                var attendingDietQuery = _populateAttendingAttendeeAttribute('diet', _populateStats('diet', stats));
                queries.push(attendingDietQuery);

                var attendingShirtSizeQuery = _populateAttendingAttendeeAttribute('shirt_size', _populateStats('shirtSize', stats));
                queries.push(attendingShirtSizeQuery);

                var attendingGenderQuery = _populateAttendingAttendeeAttribute('gender', _populateStats('gender', stats));
                queries.push(attendingGenderQuery);

                var attendingGraduationYearQuery = _populateAttendingAttendeeAttribute('graduation_year', _populateStats('graduationYear', stats));
                queries.push(attendingGraduationYearQuery);

                var attendingMajorQuery = _populateAttendingAttendeeAttribute('major', _populateStats('major', stats));
                queries.push(attendingMajorQuery);

                var attendingIsNoviceQuery = _populateAttendingAttendeeAttribute('is_novice', _populateStats('isNovice', stats));
                queries.push(attendingIsNoviceQuery);

                var RSVPsQuery = _populateRSVPs(_populateStats('rsvps', stats));
                queries.push(RSVPsQuery);

                var RSVPTypesQuery = _populateRSVPTypes(_populateStats('type', stats));
                queries.push(RSVPTypesQuery);

                return _Promise.all(queries)
                    .then(function(){
                        return cache.storeString(STATS_RSVP_HEADER + STATS_CACHE_KEY, JSON.stringify(stats))
                            .then(function(){
                                var tenMinutesFromNow = (10*60);
                                return cache.expireKey(STATS_RSVP_HEADER + STATS_CACHE_KEY, tenMinutesFromNow)
                                    .then(function(){
                                        return stats;
                                    });
                            });
                    });
            }
        });
};

module.exports.fetchLiveEventStats = function () {
    return cache.hasKey(STATS_LIVE_HEADER + STATS_CACHE_KEY)
        .then(function(hasKey){
            if(hasKey) {
                return cache.getString(STATS_LIVE_HEADER + STATS_CACHE_KEY)
                    .then(function(object){
                        return JSON.parse(object);
                    });
            }
            else {
                var stats = {};
                var queries = [];

                var checkIns = _populateCheckins(_populateStatsField('checkins', stats));
                queries.push(checkIns);

                var checkedInEcosystemsQuery = _populateCheckedInEcosystems(_populateStats('ecosystems', stats));
                queries.push(checkedInEcosystemsQuery);

                var trackedEventQuery = _populateTrackedEvents(_populateStats('trackedEvents', stats));
                queries.push(trackedEventQuery);

                return _Promise.all(queries)
                    .then(function(){
                        return cache.storeString(STATS_LIVE_HEADER + STATS_CACHE_KEY, JSON.stringify(stats))
                            .then(function(){
                                var oneMinuteFromNow = 60;
                                return cache.expireKey(STATS_LIVE_HEADER + STATS_CACHE_KEY, oneMinuteFromNow)
                                    .then(function(){
                                        return stats;
                                    });
                            });
                    });
            }
        });
};
