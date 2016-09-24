var _Promise = require('bluebird');
var _ = require('lodash');

var roles = require('../utils/roles');

var Model = require('./Model');
var UserRole = Model.extend({
	tableName: 'user_roles',
	idAttribute: 'id',
	validations: {
		role: ['required', 'string', roles.verifyRole]
	}
});

/**
 * Adds a role to the specified user. If the role already exists, it is returned
 * unmodified
 * @param {User} user		the target user
 * @param {String} role		the string representation of the role from utils.roles
 * @param {Boolean} active	whether or not the role should be activated (defaults to true)
 * @returns {Promise<UserRole>} the result of the addititon
 */
UserRole.addRole = function (user, role, active) {
	var userRole = UserRole.forge({ user_id: user.id, role: role });
	return UserRole
		.transaction(function (t) {
			return userRole
				.fetch({ transacting: t })
				.then(function (result) {
					if (result) {
						return _Promise.resolve(result);
					}
					userRole.set({ active: (_.isUndefined(active) || active) });
					return userRole.save(null, { transacting: t });
				});
		});
};

/**
 * Sets the activation state of the role. If the userRole.active and active
 * fields are the same, the role is returned unmodified
 * @param {UserRole} userRole	the role to modify
 * @param {Boolean} active		whether or not the role should be active
 * @returns {Promise<UserRole>} the updated role
 */
UserRole.setActive = function (userRole, active) {
	if (userRole.get('active') == active) {
		return _Promise.resolve(userRole);
	}
	return userRole.set({ active: active }).save();
};

UserRole.prototype.serialize = function () {
	return _.omit(this.attributes, 'userId');
};

module.exports = UserRole;
