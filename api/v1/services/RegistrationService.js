const CheckitError = require('checkit')
	.Error;
const _Promise = require('bluebird');
const _ = require('lodash');

const Model = require('../models/Model');
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const Attendee = require('../models/Attendee');
const UserRole = require('../models/UserRole');
const MailService = require('../services/MailService');
const errors = require('../errors');
const utils = require('../utils');

/**
 * Persists (insert or update) a model instance and creates (insert only) any
 * related models as provided by the related mapping. Use #extractRelatedObjects
 * in combination with #adjustRelatedObjects to update related models.
 * @param  {Model} model	a model object to be created/updated
 * @param  {Object} related an object mapping related models to array of related
 *                          model attribute objects
 * @param  {Transaction} t	a pending transaction
 * @return {Promise<Model>} the model with its related models
 */
function _saveWithRelated(model, related, t) {
	return model.save(null, {
		require: false,
		transacting: t
	})
		.then(function(model) {
			const relatedPromises = [];

			_.forIn(related, function(instances, relatedName) {
				_.forEach(instances, function(attributes) {
					relatedPromises.push(
						model.related(relatedName)
						.create(attributes, {
							transacting: t
						})
					);
				});
			});

			return _Promise.all(relatedPromises)
				.return(model);
		});
}

/**
 * Determines which related objects are new (need to be inserted) and which
 * are existing ones (need to be updated)
 * @param  {Model} model	the model with which the related objects are associated
 * @param  {String} fkName	the name of the column on which all related models
 *                         	have their foreign key
 * @param  {Object} related	an object mapping related models to array of related
 *                          model attribute objects
 * @return {Object}			mapping of new objects, updated objects, and ids of
 *                          updated objects
 */
function _extractRelatedObjects(model, fkName, related) {
	var result = {};

	_.forIn(related, function(instances, relatedName) {
		result[relatedName] = {
			new: [],
			updated: [],
			updatedIds: []
		};

		_.forEach(instances, function(attributes) {
			var MESSAGE, SOURCE;
			if (!_.has(attributes, 'id')) {
				result[relatedName].new.push(attributes);
			} else if (_.isUndefined(model.related(relatedName)
					.get(attributes.id))) {
				MESSAGE = 'A related ' + relatedName + ' object with the given ID does not exist';
				SOURCE = relatedName + '.id';
				throw new errors.NotFoundError(MESSAGE, SOURCE);
			} else if (model.related(relatedName)
				.get(attributes.id)
				.get(fkName) !== model.get('id')) {
				MESSAGE = 'A ' + relatedName + ' object that does not belong to this resource cannot be updated here';
				throw new errors.UnauthorizedError(MESSAGE);
			} else {
				// TODO remove this once Request validator can marshal recursively
				// (prevents unauthorized reassignment of related object to another model)
				attributes[fkName] = model.get('id');

				result[relatedName].updated.push(model.related(relatedName)
					.get(attributes.id)
					.set(attributes));
				result[relatedName].updatedIds.push(attributes.id);
			}
		});
	});

	return _Promise.resolve(result);
}

/**
 * Removes unwanted objects and updates desired objects
 * @param  {Model} model			the model with which the ideas are associated
 * @param  {String} parentKey		the foreign key name for the associated model
 * @param  {Object} adjustments		the resolved result of #_extractRelatedObjects
 * @param  {Transaction} t			a pending transaction
 * @return {Promise<>}				a promise indicating all changes have been added to the transaction
 */
function _adjustRelatedObjects(model, parentKey, adjustments, t) {
	var relatedPromises = [];

	_.forIn(adjustments, function(adjustment, relatedName) {
		var promise = model.related(relatedName)
			.query()
			.transacting(t)
			.whereNotIn('id', adjustment.updatedIds)
			.where(parentKey, model.get('id'))
			.delete()
			.catch(Model.NoRowsDeletedError, function() {
				return null;
			})
			.then(function() {
				model.related(relatedName)
					.reset();

				return _Promise.map(adjustment.updated, function(updated) {
					model.related(relatedName)
						.add(updated);
					return updated.save(null, {
						transacting: t,
						require: false
					});
				});
			});

		relatedPromises.push(promise);
	});

	return _Promise.all(relatedPromises);
}

/**
 * Adds people to the correct mailing lists based on decisions
 * @param  {Object} attendee	the old set of attributes for an attendee
 * @param  {Object} decision	the set of decision attributes for an attendee
 * @return {Promise<MailingListUser>}	a promise with the save result
 */
function _addToMailingList(attendee, decision) {
	// status not finalized or nothing has changed, don't add to any list
	if (!decision.status || decision.status === 'PENDING') {
		return;
	}

	var user = User.forge({
		id: attendee.userId
	});
	var promises;

	// if the status of the user has just been finalized - this is the initial decision
	if (attendee.status === 'PENDING' && decision.status !== 'PENDING') {
		let listName;
		if (decision.status == 'ACCEPTED') {
			listName = 'wave' + decision.wave;
		} else if (decision.status == 'REJECTED') {
			listName = 'rejected';
		} else {
			listName = 'waitlisted';
		}

		promises = [];
		promises.push(MailService.addToList(user, utils.mail.lists[listName]));
		if (decision.status == 'ACCEPTED' && attendee.hasLightningInterest) {
			promises.push(MailService.addToList(user, utils.mail.lists.lightningTalks));
		}

		return _Promise.all(promises);
	}
	// applicant's wave was changed
	else if (attendee.wave != decision.wave && attendee.status === decision.status && decision.status === 'ACCEPTED') {
		var oldListName = 'wave' + attendee.wave;
		var newListName = 'wave' + decision.wave;

		promises = [];
		promises.push(MailService.removeFromList(user, utils.mail.lists[oldListName]));
		promises.push(MailService.addToList(user, utils.mail.lists[newListName]));
		return _Promise.all(promises);
	}
	// applicant accepted off of waitlist (or removed from rejected)
	else if ((attendee.status === 'WAITLISTED' || attendee.status === 'REJECTED') && decision.status === 'ACCEPTED') {
		var waveListName = 'wave' + decision.wave;
		var outgoingList = (attendee.status === 'WAITLISTED') ? utils.mail.lists.waitlisted : utils.mail.lists.rejected;

		promises = [];
		promises.push(MailService.removeFromList(user, outgoingList));
		promises.push(MailService.addToList(user, utils.mail.lists[waveListName]));
		if (attendee.hasLightningInterest) {
			promises.push(MailService.addToList(user, utils.mail.lists.lightningTalks));
		}
		return _Promise.all(promises);
	}
	// applicant rejected off of waitlist
	else if (attendee.status === 'WAITLISTED' && decision.status === 'REJECTED') {
		promises = [];
		promises.push(MailService.removeFromList(user, utils.mail.lists.waitlisted));
		promises.push(MailService.addToList(user, utils.mail.lists.rejected));
		return _Promise.all(promises);
	}
	// move applicant from accepted to rejected or waitlisted
	else if (attendee.status === 'ACCEPTED' && decision.status !== 'ACCEPTED') {
		var oldWaveName = 'wave' + attendee.wave;
		var incomingList = (attendee.status === 'WAITLISTED') ? utils.mail.lists.waitlisted : utils.mail.lists.rejected;

		promises = [];
		promises.push(MailService.removeFromList(user, utils.mail.lists[oldWaveName]));
		promises.push(MailService.addToList(user, incomingList));
		if (attendee.hasLightningInterest) {
			MailService.removeFromList(user, utils.mail.lists.lightningTalks);
		}

		return _Promise.all(promises);
	}

	return _Promise.resolve();
}

/**
 * Determines whether or not an attendee has at least one
 * project or ecosystem interest
 * @param  {Array}  projects	the projects list (or undefined)
 * @param  {Array}  ecosystemInterests the ecosystem interests list (or undefined)
 * @return {Boolean} whether or not the pairing is valid
 */
function _hasValidAttendeeAssignment(projects, ecosystemInterests) {
	return (!!projects && projects.length > 0) || (!!ecosystemInterests && ecosystemInterests.length > 0);
}

/**
 * Registers a mentor and their project ideas for the given user
 * @param  {Object} user the user for which a mentor will be registered
 * @param  {Object} attributes a JSON object holding the mentor attributes
 * @return {Promise<Mentor>} the mentor with related ideas
 * @throws {InvalidParameterError} when a mentor exists for the specified user
 */
module.exports.createMentor = function(user, attributes) {
	var mentorAttributes = attributes.mentor;
	delete attributes.mentor;

	mentorAttributes.userId = user.get('id');
	var mentor = Mentor.forge(mentorAttributes);

	return mentor.validate()
		.catch(CheckitError, utils.errors.handleValidationError)
		.then(function() {
			if (user.hasRole(utils.roles.MENTOR, false)) {
				var message = 'The given user has already registered as a mentor';
				var source = 'userId';
				throw new errors.InvalidParameterError(message, source);
			}

			return Mentor.transaction(function(t) {
				return UserRole
					.addRole(user, utils.roles.MENTOR, false, t)
					.then(function() {
						return _saveWithRelated(mentor, attributes);
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
module.exports.findMentorByUser = function(user) {
	return Mentor.findByUserId(user.get('id'))
		.tap(function(result) {
			if (_.isNull(result)) {
				var message = 'A mentor with the given user ID cannot be found';
				var source = 'userId';
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
module.exports.findMentorById = function(id) {
	return Mentor.findById(id)
		.tap(function(result) {
			if (_.isNull(result)) {
				var message = 'A mentor with the given ID cannot be found';
				var source = 'id';
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
module.exports.updateMentor = function(mentor, attributes) {
	var mentorAttributes = attributes.mentor;
	delete attributes.mentor;

	mentor.set(mentorAttributes);

	return mentor.validate()
		.catch(CheckitError, utils.errors.handleValidationError)
		.then(function() {
			return _extractRelatedObjects(mentor, 'mentorId', attributes);
		})
		.then(function(adjustments) {
			return Mentor.transaction(function(t) {
				return _adjustRelatedObjects(mentor, 'mentor_id', adjustments, t)
					.then(function() {
						return _saveWithRelated(mentor, {
							'ideas': adjustments.ideas.new
						}, t);
					});
			});
		});
};

/**
 * Registers an attendee for the given user
 * @param  {Object} user the user for which an attendee will be registered
 * @param  {Object} attributes a JSON object holding the attendee attributes
 * @return {Promise<Attendee>} the attendee with their related properties
 * @throws {InvalidParameterError} when an attendee exists for the specified user
 */
module.exports.createAttendee = function(user, attributes) {
	if (!_hasValidAttendeeAssignment(attributes.projects, attributes.ecosystemInterests)) {
		var message = 'One project or ecosystem interest must be provided';
		var source = ['projects', 'ecosystemInterests'];
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}

	var attendeeAttrs = attributes.attendee;
	delete attributes.attendee;

	attendeeAttrs.userId = user.get('id');
	var attendee = Attendee.forge(attendeeAttrs);

	return attendee.validate()
		.catch(CheckitError, utils.errors.handleValidationError)
		.then(function() {
			if (user.hasRole(utils.roles.ATTENDEE, false)) {
				var message = 'The given user has already registered as an attendee';
				var source = 'userId';
				throw new errors.InvalidParameterError(message, source);
			}

			return Attendee.transaction(function(t) {
				return UserRole
					.addRole(user, utils.roles.ATTENDEE, false, t)
					.then(function() {
						return _saveWithRelated(attendee, attributes, t);
					});
			});
		});
};

/**
 * Finds an attendee by querying on a user's ID
 * @param  {User} user		the user expected to be associated with an attendee
 * @param  {Boolean} withResume	whether or not to fetch the attendee with its resume
 * @return {Promise<Attendee>}	resolving to the associated Attendee model
 * @throws {NotFoundError} when the requested attendee cannot be found
 */
module.exports.findAttendeeByUser = function(user, withResume) {
	var findFunction;
	if (withResume)
		findFunction = Attendee.fetchWithResumeByUserId;
	else
		findFunction = Attendee.findByUserId;

	return findFunction(user.get('id'))
		.tap(function(result) {
			if (_.isNull(result)) {
				var message = 'A attendee with the given user ID cannot be found';
				var source = 'userId';
				throw new errors.NotFoundError(message, source);
			}
		});
};

/**
 * Finds an attendee by querying for the given ID
 * @param  {Number} id the ID to query
 * @param  {Boolean} withResume	whether or not to fetch the attendee with its resume
 * @return {Promise<Attendee>} resolving to the associated Attendee model
 * @throws {NotFoundError} when the requested attendee cannot be found
 */
module.exports.findAttendeeById = function(id, withResume) {
	var findFunction;
	if (withResume)
		findFunction = Attendee.fetchWithResumeById;
	else
		findFunction = Attendee.findById;

	return findFunction(id)
		.tap(function(result) {
			if (_.isNull(result)) {
				var message = 'A attendee with the given ID cannot be found';
				var source = 'id';
				throw new errors.NotFoundError(message, source);
			}
		});
};


/**
 * Updates an attendee and their relational tables by relational user
 * @param  {Attendee} attendee the attendee to be updated
 * @param  {Object} attributes a JSON object holding the attendee registration attributes
 * @return {Promise} resolving to an object in the same format as attributes, holding the saved models
 * @throws {InvalidParameterError} when an attendee doesn't exist for the specified user
 */
module.exports.updateAttendee = function(attendee, attributes) {
	// some attendee registration attributes are optional, but we need to
	// be sure that they are at least considered for removal during adjustment
	attributes = _.merge(attributes, {
		'ecosystemInterests': [],
		'projects': [],
		'extras': [],
		'collaborators': []
	});

	if (!_hasValidAttendeeAssignment(attributes.projects, attributes.ecosystemInterests)) {
		var message = 'One project or ecosystem interest must be provided';
		var source = ['projects', 'ecosystemInterests'];
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}

	var attendeeAttrs = attributes.attendee;
	delete attributes.attendee;

	var user = User.forge({
		id: attendee.get('userId')
	});
	if ((!!attendee.get('hasLightningInterest')) !== attendeeAttrs.hasLightningInterest) {
		// preferences were changed
		if (attendee.get('status') !== 'ACCEPTED') {
			// we do not add attendees to this list until they have been accepted
		} else if (attendeeAttrs.hasLightningInterest) {
			MailService.addToList(user, utils.mail.lists.lightningTalks);
		} else {
			MailService.removeFromList(user, utils.mail.lists.lightningTalks);
		}
	}

	attendee.set(attendeeAttrs);

	return attendee.validate()
		.catch(CheckitError, utils.errors.handleValidationError)
		.then(function() {
			return _extractRelatedObjects(attendee, 'attendeeId', attributes);
		})
		.then(function(adjustments) {
			return Attendee.transaction(function(t) {
				return _adjustRelatedObjects(attendee, 'attendee_id', adjustments, t)
					.then(function() {
						var newRelated = _.mapValues(adjustments, function(adjustment) {
							return adjustment.new;
						});
						return _saveWithRelated(attendee, newRelated, t);
					});
			});
		});
};


module.exports.applyDecision = function(attendee, decisionAttrs) {
	var prevAttendeeAttrs = _.clone(attendee.attributes);

	return attendee.validate()
		.catch(CheckitError, utils.errors.handleValidationError)
		.then(function() {
			return attendee.save(decisionAttrs, {
				patch: true,
				require: false
			});
		})
		.then(function(model) {
			_addToMailingList(prevAttendeeAttrs, decisionAttrs);
			return model;
		});
};

/**
 * Fetches all attendees by a specified order and category
 * @param  {int} page the page of the paginated response JSON
 * @param  {int} number of results of per page
 * @param {string} category to sort by
 * @param {int} ascending 0 or 1 signaling what way to order the results
 * @return {Promise} resolving to a the list of attendees
 */
module.exports.fetchAllAttendees = function(page, count, category, ascending) {
	var ordering = (ascending ? '' : '-') + utils.database.format(category);
	return Attendee.forge()
		.orderBy(ordering)
		.fetchPage({
			pageSize: count,
			page: page
		})
		.then(function(results) {
			var attendees = _.map(results.models, 'attributes');
			return attendees;
		});
};

/**
 * Fetches attendees by either first or last name
 * @param  {int} page the page of the paginated response JSON
 * @param  {int} number of results of per page
 * @param  {string} category to sort by
 * @param  {int} ascending 0 or 1 signaling what way to order the results
 * @param  {string} searchTerm the name of the person to find
 * @return {Promise} resolving to a the list of attendees
 */
module.exports.findAttendeesByName = function(page, count, category, ascending, searchTerm) {
	var ordering = (ascending ? '' : '-') + utils.database.format(category);
	return Attendee
		.query(function(qb) {
			qb.where('first_name', 'LIKE', searchTerm)
				.orWhere('last_name', 'LIKE', searchTerm);
		})
		.orderBy(ordering)
		.fetchPage({
			pageSize: count,
			page: page
		})
		.then(function(results) {
			var attendees = _.map(results.models, 'attributes');
			return attendees;
		});
};

/**
 * Fetches attendees by either first or last name
 * @param  {int} page the page of the paginated response JSON
 * @param  {int} number of results of per page
 * @param  {string} category to sort by
 * @param  {int} ascending 0 or 1 signaling what way to order the results
 * @param  {string} filterCategory the category to filter by
 * @param  {string} filterVal the value of the filter to go by
 * @return {Promise} resolving to a the list of attendees
 */
module.exports.filterAttendees = function(page, count, category, ascending, filterCategory, filterVal) {
	var ordering = (ascending ? '' : '-') + utils.database.format(category);
	filterCategory = utils.database.format(filterCategory);
	return Attendee
		.query(function(qb) {
			qb.where(filterCategory, '=', filterVal);
		})
		.orderBy(ordering)
		.fetchPage({
			pageSize: count,
			page: page
		})
		.then(function(results) {
			var attendees = _.map(results.models, 'attributes');
			return attendees;
		});
};
