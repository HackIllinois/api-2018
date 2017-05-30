const _ = require('lodash');

const InvalidParameterError = require('../errors/InvalidParameterError');
const Announcement = require('../models/Announcement');

/**
 * Retrieves all announcements within the given bounds in order descending from creation
 * @param  {Date} before the date at which to start querying (optional)
 * @param  {Date} after the date at which to stop querying (optional)
 * @param  {Number} limit the maximum number of announcements to return (optional)
 * @return {Promise<Collection>} a promise resolving to a collection of Announcements
 */
module.exports.getAllAnnouncements = function (before, after, limit) {
	return Announcement.findAll(before, after, limit);
};

/**
 * Creates a new announcement
 * @param  {Object} parameters the parameters for creation
 * @return {Promise<Announcement>} a promise resolving to a new Announcement
 */
module.exports.createAnnouncement = function (parameters) {
	return Announcement.forge(parameters).save();
};

/**
 * Finds an announcement by its id
 * @param  {Number} id the id of the Announcement to be queried
 * @return {Promise<Announcement>} a promise resolving to the desired Announcement
 * @throws {InvalidParameterError} when no Announcement can be found
 */
module.exports.findById = function (id) {
	return Announcement.findById(id).then((result) => {
		if (_.isNil(result)) {
			const message = 'An Announcement with the given id does not exist';
			const source = 'id';
			throw new InvalidParameterError(message, source);
		}

		return result;
	});
};

/**
 * Updates an announcement
 * @param  {Announcement} announcement an existing announcement
 * @param  {Object} parameters the key-value pairs with which to update the announcement
 * @return {Promise<Announcement>} a promise resolving to the updated announcement
 */
module.exports.updateAnnouncement = function (announcement, parameters) {
	announcement.set(parameters);
	return announcement.save();
};

/**
 * Deletes an announcement
 * @param  {Announcement} announcement an existing announcement
 * @return {Promise<>} an empty-resolving promise
 */
module.exports.deleteAnnouncement = function (announcement) {
	return announcement.destroy();
};
