var _Promise = require('bluebird');
var _ = require('lodash');

var database = require('../../database');

var Attendee = require('../models/Attendee');
var AttendeeEcosystemInterest = require('../models/AttendeeEcosystemInterest')
var Ecosystem = require('../models/Ecosystem');
var User = require('../models/User');

var errors = require('../errors');
var utils = require('../utils');
var cache = utils.cache;


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
            var populateStats = function(key) {
                return function(result){
                    stats[key] = {};
                    _.forEach(result.models, function(model){
                        stats[key][model.attributes.name] = model.attributes.count;
                    });
                };
            };
            var queries = [];

            // Ecosystems stats
            var ecosystemsQuery = AttendeeEcosystemInterest.query(function(qb){
                qb.select('e.name').count('ecosystem_id as count').from('attendee_ecosystem_interests as aei').innerJoin('ecosystems as e', 'e.id', 'aei.ecosystem_id').groupBy('aei.ecosystem_id');
            })
            .fetchAll()
            .then(populateStats('ecosystems'));
            queries.push(ecosystemsQuery);

            // School  stats
            var schoolQuery = Attendee.query(function(qb){
                qb.select('school as name').count('school as count').from('attendees').groupBy('school');
            })
            .fetchAll()
            .then(populateStats('school'));
            queries.push(schoolQuery);

            // Transportation preference stats
            var transportationQuery = Attendee.query(function(qb){
                qb.select('transportation as name').count('transportation as count').from('attendees').groupBy('transportation');
            })
            .fetchAll()
            .then(populateStats('transportation'));
            queries.push(transportationQuery);

            // Dietary preference stats
            var dietQuery = Attendee.query(function(qb){
                qb.select('diet as name').count('diet as count').from('attendees').groupBy('diet');
            })
            .fetchAll()
            .then(populateStats('diet'));
            queries.push(dietQuery);

            // Shirt size stats
            var shirtSizeQuery = Attendee.query(function(qb){
                qb.select('shirt_size as name').count('shirt_size as count').from('attendees').groupBy('shirt_size');
            })
            .fetchAll()
            .then(populateStats('shirtSize'));
            queries.push(shirtSizeQuery);

            // Gender stats
            var genderQuery = Attendee.query(function(qb){
                qb.select('gender as name').count('gender as count').from('attendees').groupBy('gender');
            })
            .fetchAll()
            .then(populateStats('gender'));
            queries.push(genderQuery);

            // Year stats
            var graduationYearQuery = Attendee.query(function(qb){
                qb.select('graduation_year as name').count('graduation_year as count').from('attendees').groupBy('graduation_year');
            })
            .fetchAll()
            .then(populateStats('graduationYear'));
            queries.push(graduationYearQuery);

            // Major stats
            var majorQuery = Attendee.query(function(qb){
                qb.select('major as name').count('major as count').from('attendees').groupBy('major');
            })
            .fetchAll()
            .then(populateStats('major'));
            queries.push(majorQuery);

            // Novice stats
            var isNoviceQuery = Attendee.query(function(qb){
                qb.select('is_novice as name').count('is_novice as count').from('attendees').groupBy('is_novice');
            })
            .fetchAll()
            .then(populateStats('isNovice'));
            queries.push(isNoviceQuery);

            // Total attendee stats
            var attendeeQuery = Attendee.query(function(qb){
                qb.count('id as count');
            })
            .fetch()
            .then(function(model){
                stats.attendees = model.attributes.count;
            });
            queries.push(attendeeQuery);

            return _Promise.all(queries)
            .then(function(){
                var tenMinutesFromNow = (10*60);
                return cache.storeString('stats', JSON.stringify(stats))
                .then(function(){
                    return cache.expireKey('stats', tenMinutesFromNow)
                    .then(function(){
                        return stats;
                    });
                });
            });
        }
    });

};
