var _Promise = require('bluebird');

var errors = require('../errors');
var roles = require('../utils/roles');

/**
 * Determines whether the provided creator can create a user
 * with the provided user role
 * @param  {User} creator 		the intended creator with related role information
 * @param  {String} userRole    the role of the desired user
 * @return {Promise<Boolean>}   resolving whether or not creation should be allowed
 * @throws {UnauthorizedError}  when the provided role is not authorized (rejected promise)
 */
module.exports.canCreateUser = function (creator, userRole) {
	if (creator.hasRole(roles.SUPERUSER)) {
		// the superuser can create anyone
		return _Promise.resolve(true);
	}
	if (roles.isIn(roles.COMMON, userRole) && creator.hasRoles(roles.ORGANIZERS)) {
		// the organizers must be able to create any of the
		// common roles
		return _Promise.resolve(true);
	}

	var message = "The requested user cannot be created with the provided credentials";
	return _Promise.reject(new errors.UnauthorizedError(message));
};
