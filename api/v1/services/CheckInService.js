var CheckitError = require('checkit').Error;
var _ = require('lodash');

var CheckIn = require('../models/CheckIn');
var UserService = require('../services/UserService');
var errors = require('../errors');
var utils = require('../utils');


/**
 * Finds a CheckIn by User ID
 * @param {Number} userId id of requested user
 * @returns {Promise} the resolved CheckIn for the user
 * @throws {NotFoundError} when the user has no check in
 */
module.exports.findCheckInByUserId = function (userId){
    return CheckIn
        .findByUserId(userId)
        .then(function (checkin){
            if (_.isNull(checkin)) {
                var message = "A check in record cannot be found for the given user";
                var source = "userId";
                throw new errors.NotFoundError(message, source);
            }
            return checkin;
        })
};

/**
 * Updates the CheckIn values to request
 * @param {Obejct} attributes to be updated
 * @returns {Promise} the resolved CheckIn for the user
 */
module.exports.updateCheckIn = function (attributes){
    return module.exports.findCheckInByUserId(attributes.userId)
        .then(function(checkin) {
            var updates = {
                "swag": attributes.swag || checkin.get('swag'),
                "location": attributes.location || checkin.get('location')
            };
            checkin.set(updates, {patch: true});
            return checkin.save();
        });
};

/**
 * Creates a CheckIn object for given user with the given attributes
 * @param {Object} attributes values requested
 * @returns {Promise} resolving to CheckIn object
 */
module.exports.createCheckIn = function (attributes){
    return CheckIn.findByUserId(attributes.userId)
        .then(function (checkin){
            if (!_.isNull(checkin)) {
                var message = "A check in record already exists for this user";
                var source = "userId";
                throw new errors.InvalidParameterError(message, source);
            }
            checkin = CheckIn.forge({ userId: attributes.userId, location: attributes.location, swag: attributes.swag});
            return checkin
                .validate()
                .catch(CheckitError, utils.errors.handleValidationError)
                .then(function(validation) {
                    return checkin.save();
                })
        });
};
