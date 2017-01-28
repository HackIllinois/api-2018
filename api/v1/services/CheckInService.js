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
module.exports.findCheckInByUserId = function (userId){
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
        .catch(function(error){
            return _Promise.reject(error);
        })
};

/**
 * Updates portions of the checkin that are included
 * @param checkin the CheckIn to update
 * @param {Obejct} attributes the new CheckIn data to set
 * @returns {Promise} the resolved CheckIn for the user
 */
module.exports.updateCheckIn = function (checkin, attributes){

    if(!checkin.get('checkedIn')){
        checkin.set({'checkedIn': false});
        if (attributes.checkedIn == true){
            checkin.set({'checkedIn': attributes.checkedIn, 'time': utils.time.sqlTime()});
        }else if (attributes.checkedIn !== false && attributes.checkedIn != undefined){
            message = "checkedIn must be true or false";
            source = "checkedIn";
            throw new errors.InvalidParameterError(message, source);
        }
    }else{
        checkin.set({'checkedIn': true});
        if (attributes.checkedIn == true){
            var message = "User already checked in";
            var source = "CheckIn";
            throw new errors.UnauthorizedError(message, source);
        }
    }

    if(!checkin.get('swag')){
        checkin.set({'swag': false});
        if (attributes.swag === true){
            checkin.set({'swag': attributes.swag})
        }else if (attributes.swag !== false && attributes.swag != undefined){
            message = "swag must be true or false";
            source = "swag";
            throw new errors.InvalidParameterError(message, source);
        }
    }else{
        checkin.set({'swag': true});
        if (attributes.swag == true){
            var message = "Swag has already been checked";
            var source = "swag";
            throw new errors.UnauthorizedError(message, source);
        }
    }

    if (attributes.location){
        checkin.set({'location': attributes.location})
    }

    return checkin
        .validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function (validated){
            return checkin.save();
        });

};
