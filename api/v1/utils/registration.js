var _ = require('lodash');

var TSHIRT_SIZES = ['S', 'M', 'L', 'XL'];
var STATUSES = ['ACCEPTED', 'WAITLISTED', 'REJECTED', 'PENDING'];


/**
 * Ensures that the provided tshirt-size is in the list
 * of valid size options
 * @param  {String} size the value to check
 * @return {Boolean} true when the size is valid
 * @throws TypeError when the size is invalid
 */
module.exports.verifyTshirtSize = function (size) {
	if (!_.includes(TSHIRT_SIZES, size)) {
		throw new TypeError(size + " is not a valid size");
	}

	return true;
};

/**
 * Ensures that the provided status is in the list
 * of valid status options
 * @param  {String} size the value to check
 * @return {Boolean} true when the status is valid
 * @throws TypeError when the status is invalid
 */
module.exports.verifyStatus = function (status) {
	if (!_.includes(STATUSES, status)) {
		throw new TypeError(status + " is not a valid status");
	}

	return true;
};
