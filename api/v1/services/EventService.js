const _Promise = require('bluebird');

const utils = require('../utils');
const Location = require('../models/Location');
const Event = require('../models/Event');
const EventLocation = require('../models/EventLocation');

module.exports.getAllLocations = function() {
	return Location.fetchAll();
};

module.exports.createLocation = function(params) {
	const location = Location.forge(params);

	return location.save()
		.catch(
			utils.errors.DuplicateEntryError,
			utils.errors.handleDuplicateEntryError('A location with the given name already exists', 'name')
		);
};

module.exports.getEvents = function(getActive) {
	if (getActive) {
		return Event.query((qb) => {
			qb.whereRaw('end_time > current_time()')
					.andWhereRaw('start_time < current_time()');
		})
			.fetchAll({
				withRelated: ['locations']
			});
	} else {
		return Event.fetchAll({
			withRelated: ['locations']
		});
	}
};

module.exports.createEvent = function(params) {
	const event = params.event;
	const locations = params.eventLocations;

	return Event.transaction((t) => {
		return new Event(event)
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
							.then((locationResult) => {
								return {
									'event': result,
									'eventLocations': locationResult
								};
							});
					} else {
						return {
							'event': result
						};
					}
				});
	})
		.catch(
			utils.errors.DuplicateEntryError,
			utils.errors.handleDuplicateEntryError('An event with the given name already exists', 'name')
		);
};
