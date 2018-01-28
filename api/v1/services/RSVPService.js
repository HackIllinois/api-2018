const CheckitError = require('checkit').Error;
const _Promise = require('bluebird');
const _ = require('lodash');

const RSVP = require('../models/AttendeeRSVP');
const UserRole = require('../models/UserRole');
const errors = require('../errors');
const utils = require('../utils');

const StatsService = require('../services/StatsService');

/**
 * Gets an rsvp by its id
 * @param {integer} id the id of the RSVP to find
 * @returns {Promise} the resolved rsvp
 */
module.exports.getRSVPById = (id) => RSVP.findById(id);

/**
 * Creates an RSVP and sets the users attendee role to active
 * @param {Attendee} attendee the associated attendee for the rsvp
 * @param {User} user the associated user for the rsvp
 * @param {Object} attributes the rsvp data
 * @returns {Promise} the resolved rsvp
 * @throws {InvalidParameterError} thrown when an attendee already has an rsvp
 */
module.exports.createRSVP = (attendee, user, attributes) => {

  StatsService.incrementStat('rsvp', 'school', attendee.get('school'));
  StatsService.incrementStat('rsvp', 'transportation', attendee.get('transportation'));
  StatsService.incrementStat('rsvp', 'diet', attendee.get('diet'));
  StatsService.incrementStat('rsvp', 'shirt_size', attendee.get('shirtSize'));
  StatsService.incrementStat('rsvp', 'gender', attendee.get('gender'));
  StatsService.incrementStat('rsvp', 'graduation_year', attendee.get('graduationYear'));
  StatsService.incrementStat('rsvp', 'major', attendee.get('major'));
  StatsService.incrementStat('rsvp', 'is_novice', attendee.get('isNovice'));
  StatsService.incrementStat('rsvp', 'attendees', 'count');


  attributes.attendeeId = attendee.get('id');
  const rsvp = RSVP.forge(attributes);

  return rsvp
    .validate()
    .catch(CheckitError, utils.errors.handleValidationError)
    .then(() => RSVP.transaction((t) => rsvp.save(null, {
      transacting: t
    })
      .tap(() => {
        const userRole = user.getRole(utils.roles.ATTENDEE);
        return UserRole.setActive(userRole, true, t);
      })))
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
module.exports.findRSVPByAttendee = (attendee) => RSVP
    .findByAttendeeId(attendee.get('id'))
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'An RSVP cannot be found for the given attendee';
        const source = 'attendeeId';
        throw new errors.NotFoundError(message, source);
      }

      return _Promise.resolve(result);
    });

/**
 * Updates a given RSVP
 * @param {RSVP} rsvp the RSVP to update
 * @param {Object} attributes the new RSVP data to set
 * @returns {Promise} the resolved RSVP
 */
module.exports.updateRSVP = (user, rsvp, attributes) => {
  rsvp.set({
    'type': null
  });
  rsvp.set(attributes);

  return rsvp
    .validate()
    .catch(CheckitError, utils.errors.handleValidationError)
    .then(() => {
      const userRole = user.getRole(utils.roles.ATTENDEE);
      rsvp.get('isAttending') ? UserRole.setActive(userRole, true) : UserRole.setActive(userRole, false); //eslint-disable-line no-unused-expressions

      return rsvp.save();
    });
};
