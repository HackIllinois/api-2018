var CheckitError = require('checkit')
  .Error;
var _Promise = require('bluebird');
var _ = require('lodash');

var RSVP = require('../models/AttendeeRSVP');
var UserRole = require('../models/UserRole');
var errors = require('../errors');
var utils = require('../utils');

/**
 * Gets an rsvp by its id
 * @param {integer} id the id of the RSVP to find
 * @returns {Promise} the resolved rsvp
 */
module.exports.getRSVPById = function(id) {
    return RSVP.findById(id);
};

/**
 * Creates an RSVP and sets the users attendee role to active
 * @param {Attendee} attendee the associated attendee for the rsvp
 * @param {User} user the associated user for the rsvp
 * @param {Object} attributes the rsvp data
 * @returns {Promise} the resolved rsvp
 * @throws {InvalidParameterError} thrown when an attendee already has an rsvp
 */
module.exports.createRSVP = function(attendee, user, attributes) {
    attributes.attendeeId = attendee.get('id');
    var rsvp = RSVP.forge(attributes);

    return rsvp
    .validate()
    .catch(CheckitError, utils.errors.handleValidationError)
    .then(function() {
        return RSVP.transaction(function(t) {
            return rsvp.save(null, {
                transacting: t
            })
          .tap(function() {
              var userRole = user.getRole(utils.roles.ATTENDEE);
              return UserRole.setActive(userRole, true, t);
          });
        });
    })
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('An RSVP already exists for the given attendee', 'attendeeId')
    );
};

/**
 * Finds an RSVP by its associated attendee
 * @param {Attendee} attendee the associated attendee for the rsvp
 * @returns {Promise} the resolved rsvp for the attendee
 * @throws {NotFoundError} when the attendee has no RSVP
 */
module.exports.findRSVPByAttendee = function(attendee) {
    return RSVP
    .findByAttendeeId(attendee.get('id'))
    .then(function(result) {
        if (_.isNull(result)) {
            var message = 'An RSVP cannot be found for the given attendee';
            var source = 'attendeeId';
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
module.exports.updateRSVP = function(user, rsvp, attributes) {
    rsvp.set({
        'type': null
    });
    rsvp.set(attributes);

    return rsvp
    .validate()
    .catch(CheckitError, utils.errors.handleValidationError)
    .then(function() {
        var userRole = user.getRole(utils.roles.ATTENDEE);
        rsvp.get('isAttending') ? UserRole.setActive(userRole, true) : UserRole.setActive(userRole, false);

        return rsvp.save();
    });
};
