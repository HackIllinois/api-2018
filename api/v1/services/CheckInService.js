const _ = require('lodash');

const CheckIn = require('../models/CheckIn');
const NetworkCredential = require('../models/NetworkCredential');
const errors = require('../errors');
const utils = require('../utils');

const StatsService = require('../services/StatsService');

/**
 * Finds a CheckIn by User ID
 * @param {Number} userId id of requested user
 * @returns {Promise} the resolving to obect {checkin: {CheckIn object}, credentials: {Credential object}}
 * @throws {NotFoundError} when the user has no check in
 */
module.exports.findCheckInByUserId = (userId) => CheckIn
    .findByUserId(userId)
    .then((checkin) => {
      if (_.isNull(checkin)) {
        const message = 'A check in record cannot be found for the given user';
        const source = 'userId';
        throw new errors.NotFoundError(message, source);
      }
      return NetworkCredential.findByUserId(userId)
        .then((credentials) => ({
          'checkin': checkin,
          'credentials': credentials
        }));
    });

/**
 * Updates the CheckIn values to request
 * @param {Obejct} attributes to be updated
 * @returns {Promise} the resolved obect {checkin: {CheckIn object}}
 */
module.exports.updateCheckIn = (attributes) => module.exports.findCheckInByUserId(attributes.userId)

    .then((checkin) => {
      checkin = checkin.checkin;
      const updates = {
        'swag': attributes.swag || checkin.get('swag'),
        'location': attributes.location || checkin.get('location')
      };
      checkin.set(updates, {
        patch: true
      });
      return checkin.save()
        .then((model) => NetworkCredential.findByUserId(attributes.userId)
          .then((credentials) => ({
            'checkin': model,
            'credentials': credentials
          })));
    });

/**
 * Creates a CheckIn object for given user with the given attributes
 * @param {Object} attribute values requested
 * @returns {Promise} resolving to obect {checkin: {CheckIn object}, credentials: {Credential object}}
 * @throws {InvalidParameterError} when the user has already checked in
 */
module.exports.createCheckIn = (attributes) => {
  const credentialsRequested = attributes.credentialsRequested;
  delete attributes.credentialsRequested;

  StatsService.incrementStat('liveevent', 'attendees', 'count');

  return CheckIn.transaction((t) => new CheckIn(attributes)
      .save(null, {
        transacting: t
      })
      .then((model) => {
        if (credentialsRequested) {
          return NetworkCredential.findUnassigned();
        }
        return model;

      })
      .then((model) => {
        if (credentialsRequested) {
          if (_.isNull(model)) {
            const message = 'There are no remaining unassigned network credentials';
            const source = 'NetworkCredential';
            throw new errors.UnprocessableRequestError(message, source);
          }

          const updates = {
            'userId': attributes.userId,
            'assigned': true
          };
          model.set(updates, {
            patch: true
          });

          return model.save(null, {
            transacting: t
          })
            .then((creds) => ({
              'checkin': model,
              'credentials': creds
            }));
        }
        return {
          'checkin': model
        };

      }))
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('The user is already checked in', 'userId')
    );
};
