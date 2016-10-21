/* jshint esversion: 6 */

var CheckitError = require('checkit').Error;
var _Promise = require('bluebird');
var _ = require('lodash');

var Mentor = require('../models/Mentor');
var MentorProjectIdea = require('../models/MentorProjectIdea');
var UserRole = require('../models/UserRole');
var errors = require('../errors');
var utils = require('../utils');

/**
 * Persists a mentor and its ideas
 * @param  {Mentor} mentor	a mentor object to be created/updated
 * @param  {Array} ideas 	an array of raw mentor attributes
 * @param  {Transaction} t	a pending transaction
 * @return {Promise<Mentor>} the mentor with related ideas
 */
function _saveMentorAndIdeas(mentor, ideas, t) {
	return mentor
		.save(null, { transacting: t })
		.then(function (mentor) {
			return _Promise.map(ideas, function (idea) {
				return mentor.related('ideas').create(idea, { transacting: t });
			}).return(mentor);
		});
}

/**
* Registers a mentor and their project ideas for the given user
* @param  {Object} user the user for which a mentor will be registered
* @param  {Object} attributes a JSON object holding the mentor attributes
* @return {Promise<Mentor>} the mentor with related ideas
* @throws {InvalidParameterError} when a mentor exists for the specified user
*/
var createMentor = function (user, attributes) {
	var mentorAttributes = attributes.mentor;
	var mentorIdeas = attributes.ideas;

	mentorAttributes.userId = user.get('id');
	var mentor = Mentor.forge(mentorAttributes);

	return mentor
		.validate()
		.catch(CheckitError, utils.errors.handleValidationError)
		.then(function (validated) {
			if (user.hasRole(utils.roles.MENTOR, false)) {
				var message = "The given user has already registered as a mentor";
				var source = "userId";
				throw new errors.InvalidParameterError(message, source);
			}

			return Mentor.transaction(function (t) {
				return UserRole
					.addRole(user, utils.roles.MENTOR, false, t)
					.then(function (result) {
						return _saveMentorAndIdeas(mentor, mentorIdeas);
					});
				});
			});
};

/**
* Finds a mentor by querying on a user's ID
* @param  {User} user		the user expected to be associated with a mentor
* @return {Promise<Mentor>}	resolving to the associated Mentor model
* @throws {NotFoundError} when the requested mentor cannot be found
*/
var findMentorByUser = function (user) {
	return Mentor
		.findByUserId(user.get('id'))
		.tap(function (result) {
			if (_.isNull(result)) {
				var message = "A mentor with the given user ID cannot be found";
				var source = "userId";
				throw new errors.NotFoundError(message, source);
			}
		});
};

/**
* Finds a mentor by querying for the given ID
* @param  {Number} id the ID to query
* @return {Promise<Mentor>} resolving to the associated Mentor model
* @throws {NotFoundError} when the requested mentor cannot be found
*/
var findMentorById = function (id) {
	return Mentor
		.findById(id)
		.tap(function (result) {
			if (_.isNull(result)) {
				var message = "A mentor with the given ID cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}
		});
};

/**
* Updates a mentor and their project ideas by relational user
* @param  {Mentor} mentor the mentor to be updated
* @param  {Object} attributes a JSON object holding the mentor registration attributes
* @return {Promise} resolving to an object in the same format as attributes, holding the saved models
* @throws {InvalidParameterError} when a mentor doesn't exist for the specified user
*/
var updateMentor = function (mentor, attributes) {
	var mentorAttributes = attributes.mentor;
	var mentorIdeas = attributes.ideas;

	mentor.set(mentorAttributes);
	mentor.related('ideas').reset();

	return mentor
		.validate()
		.catch(CheckitError, utils.errors.handleValidationError)
		.then(function (validated) {
			return Mentor.transaction(function (t) {
				return mentor.related('ideas')
					.invokeThen('destroy', { transacting: t })
					.then(function () {
						return _saveMentorAndIdeas(mentor, mentorIdeas);
					});
			});
		});
};

module.exports = {
	createMentor: createMentor,
	findMentorByUser: findMentorByUser,
	findMentorById: findMentorById,
	updateMentor: updateMentor
};
