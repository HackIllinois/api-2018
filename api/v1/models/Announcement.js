const _ = require('lodash');

const Model = require('./Model');
const Announcement = Model.extend({
	tableName: 'announcements',
	idAttribute: 'id',
	hasTimestamps: ['created'],
	validations: {
		'title': ['required', 'string', 'maxLength:255'],
		'description': ['required', 'string', 'maxLength:1000']
	}
});

/**
 * Creates a query builder handler for findAll
 * @param  {Date} before see #findAll
 * @param  {Date} after  see #findAll
 * @param  {Number} limit  see #findAll
 * @return {Function} a bookshelf query-builder handler
 */
function _buildFindAllQuery(before, after, limit) {
	return (qb) => {
		if (!_.isNil(before)) {
			qb.where('created', '<', before);
		}
		if (!_.isNil(after)) {
			if (!_.isNil(before)) {
				qb.andWhere('created', '>', after);
			} else {
				qb.where('created', '>', after);
			}
		}
		if (!_.isNil(limit)) {
			qb.limit(limit);
		}
	};
}

/**
 * Finds all announcements before/after specific dates
 * @param  {Date} before the latest date to look for announcements (optional)
 * @param  {Date} after  the earliest date to look for announcements (optional)
 * @param  {Number} limit the maximum number of results to return (optional)
 * @return {Promise<Collection>} a promise resolving to the resulting collection
 */
Announcement.findAll = (before, after, limit) => {
	return Announcement.query(_buildFindAllQuery(before, after, limit))
		.orderBy('created', 'DESC')
		.fetchAll();
};

module.exports = Announcement;
