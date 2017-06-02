const _Promise = require('bluebird');
const _ = require('lodash');

const roles = require('../utils/roles');

const Model = require('./Model');
const UserRole = Model.extend({
  tableName: 'user_roles',
  idAttribute: 'id',
  validations: {
    role: ['required', 'string', roles.verifyRole]
  }
});
/**
 * Saves a forged user role using the passed transaction
 */
function _addRole(userRole, active, t) {
  return userRole
    .fetch({
      transacting: t
    })
    .then((result) => {
      if (result) {
        return _Promise.resolve(result);
      }
      userRole.set({
        active: (_.isUndefined(active) || active)
      });
      return userRole.save(null, {
        transacting: t
      });
    });
}

/**
 * Adds a role to the specified user. If the role already exists, it is returned
 * unmodified
 * @param {User} user		the target user
 * @param {String} role		the string representation of the role from utils.roles
 * @param {Boolean} active	whether or not the role should be activated (defaults to true)
 * @param {Transaction} t	pending transaction (optional)
 * @returns {Promise<UserRole>} the result of the addititon
 */
UserRole.addRole = function(user, role, active, t) {
  const userRole = UserRole.forge({
    user_id: user.id,
    role: role
  });
  if (t) {
    return _addRole(userRole, active, t);
  }
  return UserRole.transaction((t) => _addRole(userRole, active, t));
};

/**
 * Sets the activation state of the role. If the userRole.active and active
 * fields are the same, the role is returned unmodified
 * @param {UserRole} userRole	the role to modify
 * @param {Boolean} active		whether or not the role should be active
 * @param {Transaction} t optional pending transaction
 * @returns {Promise<UserRole>} the updated role
 */
UserRole.setActive = function(userRole, active, t) {
  if (userRole.get('active') == active) {
    return _Promise.resolve(userRole);
  }
  return userRole.set({
    active: active
  })
    .save(null, {
      transacting: t
    });
};

UserRole.prototype.serialize = function() {
  return _.omit(this.attributes, ['id', 'userId']);
};

module.exports = UserRole;
