var Promise = require('bluebird');

var errors = require('../errors');
var roles = require('../utils/roles');

/**
 * Determines whether the provided creator role can create a user
 * with the provided user role
 * @param  {String} creatorRole the role of the creating user
 * @param  {String} userRole    the role of the desired user
 * @return {Promise}            resolving whether or not creation should be allowed
 * @throws {UnauthorizedError}  when the provided role is not authorized (rejected promise)
 */
module.exports.canCreateUser = function (creatorRole, userRole) {
	if (creatorRole === roles.SUPERUSER) {
		// the superuser can create anyone
		return Promise.resolve(true);
	}
	if (roles.isIn(roles.COMMON, userRole) &&
			roles.isIn(roles.ORGANIZERS, creatorRole)) {
		// the organizers must be able to create any of the
		// common roles
		return Promise.resolve(true);
	}

	var message = "The requested user cannot be created with the provided credentials";
	return Promise.reject(errors.UnauthorizedError(message));
};
