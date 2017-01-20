var CheckitError = require('checkit').Error;
var _Promise = require('bluebird');
var _ = require('lodash');

var RSVP = require('../models/AttendeeRSVP');
var UserRole = require('../models/UserRole');
var errors = require('../errors');
var utils = require('../utils');

/**
 * Creates an RSVP and sets the users attendee role to active
 * @param {Attendee} attendee the associated attendee for the rsvp
 * @param {User} user the associated user for the rsvp
 * @param {Object} attributes the rsvp data
 * @returns {Promise} the resolved rsvp
 * @throws {InvalidParameterError} thrown when an attendee already has an rsvp
 */
module.exports.createRSVP = function (attendee, user, attributes) {
    attributes.attendeeId = attendee.get('id');
    var rsvp = RSVP.forge(attributes);

    return rsvp
        .validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function (validated) {
            return RSVP.findByAttendeeId(attributes.attendeeId);
        })
        .then(function (result) {
            if (!_.isNull(result)) {
                var message = "An RSVP already exists for the given attendee";
                var source = "attendeeId";
                throw new errors.InvalidParameterError(message, source);
            }

            var userRole = user.getRole(utils.roles.ATTENDEE)
            UserRole.setActive(userRole, true);

            return rsvp.save();
        })
};

/**
 * Finds an RSVP by its associated attendee
 * @param {Attendee} attendee the associated attendee for the rsvp
 * @returns {Promise} the resolved rsvp for the attendee
 * @throws {NotFoundError} when the attendee has no RSVP
 */
module.exports.findRSVPByAttendee = function (attendee) {
    return RSVP
        .findByAttendeeId(attendee.get('id'))
        .then(function (result) {
            if (_.isNull(result)) {
                var message = "An RSVP cannot be found for the given attendee";
                var source = "attendeeId";
                throw new errors.NotFoundError(message, source);
            }

            return _Promise.resolve(result);
        });
};

/**
 * Updates a given RSVP
 * @param {RSVP} rsvp the RSVP to update
 * @param {Object} attributes the new RSVP data to set
 * @returns {Promise} the resolved RSVP
 */
module.exports.updateRSVP = function (rsvp, attributes) {
    rsvp.set({'type': null});
    rsvp.set(attributes);

    return rsvp
        .validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function (validated) {
            return rsvp.save();
        });
};