var _ = require('lodash');

var ALL_ROLES = ['ADMIN', 'STAFF', 'SPONSOR', 'MENTOR', 'VOLUNTEER', 'HACKER'];

_.forEach(ALL_ROLES, function (role) {
	_.assign(module.exports, role);
});

module.exports.ALL = ALL_ROLES;
module.exports.ORGANIZERS = ['ADMIN', 'STAFF'];

/**
 * Ensures that the provided role is in ALL_ROLES
 * @param  {String} role the value to check
 * @return {Boolean} true when the role is valid
 * @throws TypeError when the role is invalid
 */
module.exports.verifyRole = function (role) {
	if (!_.includes(ALL_ROLES, role)) {
		throw new TypeError(role + " is not a valid role");
	}

	return true;
};
