var CheckitError = require('checkit').Error;
var _Promise = require('bluebird');
var _ = require('lodash');

var CheckIn = require('../models/CheckIn');
var UserRole = require('../models/UserRole');
var errors = require('../errors');
var utils = require('../utils');


/**
 * Finds a CheckIn by User ID
 * @param userId id of requested user
 * @returns {Promise} the resolved CheckIn for the user
 * @throws {NotFoundError} when the user has no check in
 */
module.exports.findByUserId = function (userId){
    return CheckIn
        .findByUserId(userId)
        .then(function (checkin){
            if (_.isNull(checkin)) {
                var message = "A check in record cannot be found for the given user";
                var source = "userId";
                throw new errors.NotFoundError(message, source);
            }

            return _Promise.resolve(checkin);
        })
};

/**
 * Updates portions of the checkin that are included
 * @param checkin the CheckIn to update
 * @param {Obejct} attributes the new CheckIn data to set
 * @returns {Promise} the resovled CheckIn for the user
 */
module.exports.updateCheckIn = function (checkin, attributes){
    if (attributes.checkedIn){
        checkin.set({'checkedIn': attributes.checkedIn})
    }
    if (attributes.travel){
        checkin.set({'checkedIn': attributes.travel})
    }
    if (attributes.location){
        checkin.set({'checkedIn': attributes.location})
    }
    if (attributes.swag){
        checkin.set({'checkedIn': attributes.swag})
    }

    return checkin
        .validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function (validated){
            return checkin.save();
        });

};
