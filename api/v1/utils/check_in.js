var _ = require('lodash');

var LOCATIONS = ['NONE', 'ECEB', 'SIEBEL', 'DCL'];

/**
 * Ensures that location upon check in is valid
 * @param {String} location the check in location
 * @return {Boolean} true when the location is valid
 * @throws TypeError when the location is invalid
 */
module.exports.verifyLocation = function (location) {
    if (!_.includes(LOCATIONS, location)) {
        throw new TypeError(location + " is not a valid check in location");
    }

    return true;
}
