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


/**
 * Checks to see if a requestor valid permissions to create a new project
 * @param  {User} user creating the new project
 * @return {Promise} resolving to true if the user is an organizer
 * @throws InvalidParameterError when a user does not have correct permissions
 */
module.exports.canCreateProject = function (creator) {
	if(creator.hasRole(roles.SUPERUSER) || creator.hasRole(roles.ORGANIZERS)){
		return _Promise.resolve(true);
	}

	var message = "A project cannot be created with the provided credentials";
	return _Promise.reject(new errors.UnauthorizedError(message));
};


/**
 * Checks to see if a requester is an organizer (or superuser)
 * @param  {User} user to check roles for
 * @return {Promise} resolving to true if the user is an organizer, false otherwise
 */
module.exports.isOrganizer = function (user){
	if (user.hasRole(roles.SUPERUSER)) {
		// the superuser is allowed
		return _Promise.resolve(true);
	}
	if (user.hasRoles(roles.ORGANIZERS)) {
		// the user is an organizer
		return _Promise.resolve(true);
	}
	// return false
	return _Promise.resolve(false);

};

/**
 * Checks to see if a requester is a host
 * @param  {User} user to check roles for
 * @return {Promise} resolving to true if the user is a host, false otherwise
 */
module.exports.isOrganizer = function (user){
	if (user.hasRole(roles.SUPERUSER)) {
		return _Promise.resolve(true);
	}
	if (user.hasRoles(roles.HOSTS)) {
		return _Promise.resolve(true);
	}
	return _Promise.resolve(false);

};