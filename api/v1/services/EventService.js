var _Promise = require('bluebird');

var utils = require('../utils');
var Location = require('../models/Location');
var Event = require('../models/Event');
var EventLocation = require('../models/EventLocation');

module.exports.getAllLocations = function() {
    return Location.fetchAll();
};

module.exports.createLocation = function(params) {
    var location = Location.forge(params);

    return location.save()
		.catch(
			utils.errors.DuplicateEntryError,
			utils.errors.handleDuplicateEntryError('A location with the given name already exists', 'name')
		);
};

module.exports.getEvents = function(getActive) {
    if (getActive) {
        return Event.query(function(qb) {
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
    var event = params.event;
    var locations = params.eventLocations;

    return Event.transaction(function(t) {
        return new Event(event)
				.save(null, {
    transacting: t
})
				.then(function(result) {
    if (locations) {
        return _Promise.map(locations, function(location) {
            location.eventId = result.id;
            return new EventLocation(location)
									.save(null, {
    transacting: t
});
        })
							.then(function(locationResult) {
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
