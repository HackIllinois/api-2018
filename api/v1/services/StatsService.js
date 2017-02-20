var _Promise = require('bluebird');
var _ = require('lodash');

var database = require('../../database');

var Attendee = require('../models/Attendee');
var AttendeeRSVP = require('../models/AttendeeRSVP');
var AttendeeEcosystemInterest = require('../models/AttendeeEcosystemInterest')
var Ecosystem = require('../models/Ecosystem');
var User = require('../models/User');

var errors = require('../errors');
var utils = require('../utils');
var cache = utils.cache;

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
    return AttendeeEcosystemInterest.query(function(qb){
        qb.select('e.name').count('ecosystem_id as count').from('attendee_ecosystem_interests as aei').innerJoin('ecosystems as e', 'e.id', 'aei.ecosystem_id')
        .whereExists(function() {
            this.select('*').from('attendees').whereRaw('attendees.id = aei.attendee_id').andWhere('status', 'ACCEPTED')
            .whereExists(function() {
                this.select('*').from('attendee_rsvps').whereRaw('attendees.id = attendee_rsvps.attendee_id').andWhere('is_attending', 1);
            });
        }).groupBy('aei.ecosystem_id');
    })
    .fetchAll()
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
* Fetches the current stats, requerying them if not cached
* @return {Promise<Object>}	resolving to key-value pairs of stats
*/
module.exports.fetchStats = function () {
    return cache.hasKey('stats')
    .then(function(hasKey){
        if(hasKey) {
            return cache.getString('stats')
            .then(function(object){
                return JSON.parse(object);
            });
        }
        else {
            var stats = {}
            stats.attending = {};
            var queries = [];

            var ecosystemsQuery = _populateEcosystems(_populateStats('ecosystems', stats));
            queries.push(ecosystemsQuery);
            var attendingEcosystemsQuery = _populateAttendingEcosystems(_populateStats('ecosystems', stats.attending));
            queries.push(attendingEcosystemsQuery);

            var schoolQuery = _populateAttendeeAttribute('school', _populateStats('school', stats));
            queries.push(schoolQuery);
            var attendingSchoolQuery = _populateAttendingAttendeeAttribute('school', _populateStats('school', stats.attending));
            queries.push(attendingSchoolQuery);

            var transportationQuery = _populateAttendeeAttribute('transportation', _populateStats('transportation', stats));
            queries.push(transportationQuery);
            var attendingTransportationQuery = _populateAttendingAttendeeAttribute('transportation', _populateStats('transportation', stats.attending));
            queries.push(attendingTransportationQuery);

            var dietQuery = _populateAttendeeAttribute('diet', _populateStats('diet', stats));
            queries.push(dietQuery);
            var attendingDietQuery = _populateAttendingAttendeeAttribute('diet', _populateStats('diet', stats.attending));
            queries.push(attendingDietQuery);

            var shirtSizeQuery = _populateAttendeeAttribute('shirt_size', _populateStats('shirtSize', stats));
            queries.push(shirtSizeQuery);
            var attendingShirtSizeQuery = _populateAttendingAttendeeAttribute('shirt_size', _populateStats('shirtSize', stats.attending));
            queries.push(attendingShirtSizeQuery);

            var genderQuery = _populateAttendeeAttribute('gender', _populateStats('gender', stats));
            queries.push(genderQuery);
            var attendingGenderQuery = _populateAttendingAttendeeAttribute('gender', _populateStats('gender', stats.attending));
            queries.push(attendingGenderQuery);

            var graduationYearQuery = _populateAttendeeAttribute('graduation_year', _populateStats('graduationYear', stats));
            queries.push(graduationYearQuery);
            var attendingGraduationYearQuery = _populateAttendingAttendeeAttribute('graduation_year', _populateStats('graduationYear', stats.attending));
            queries.push(attendingGraduationYearQuery);

            var majorQuery =  _populateAttendeeAttribute('major', _populateStats('major', stats));
            queries.push(majorQuery);
            var attendingMajorQuery = _populateAttendingAttendeeAttribute('major', _populateStats('major', stats.attending));
            queries.push(attendingMajorQuery);

            var isNoviceQuery = _populateAttendeeAttribute('is_novice', _populateStats('isNovice', stats));
            queries.push(isNoviceQuery);
            var attendingIsNoviceQuery = _populateAttendingAttendeeAttribute('is_novice', _populateStats('isNovice', stats.attending));
            queries.push(attendingIsNoviceQuery);

            var attendeeQuery =  _populateAttendees(_populateStatsField('attendees', stats));
            queries.push(attendeeQuery);

            var statusQuery = _populateAttendeeAttribute('status', _populateStats('status', stats));
            queries.push(statusQuery);

            var RSVPsQuery = _populateRSVPs(_populateStats('rsvps', stats));
            queries.push(RSVPsQuery);

            var RSVPTypesQuery = _populateRSVPTypes(_populateStats('type', stats.attending));
            queries.push(RSVPTypesQuery);

            return _Promise.all(queries)
            .then(function(){
                return cache.storeString('stats', JSON.stringify(stats))
                .then(function(){
                    var tenMinutesFromNow = (10*60);
                    return cache.expireKey('stats', tenMinutesFromNow)
                    .then(function(){
                        return stats;
                    });
                });
            });
        }
    });

};
