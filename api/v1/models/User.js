/* jshint esversion: 6 */

const _Promise = require('bluebird');
const bcrypt = _Promise.promisifyAll(require('bcrypt'));
const _ = require('lodash');

const SALT_ROUNDS = 12;

const Model = require('./Model');

const UserRole = require('./UserRole');
const CheckIn = require('./CheckIn');
const User = Model.extend({
  tableName: 'users',
  idAttribute: 'id',
  hasTimestamps: ['created', 'updated'],
  validations: {
    email: ['required', 'email'],
    password: [ 'string' ],
    githubHandle: [ 'string' ]
  },
  roles: function() {
    return this.hasMany(UserRole);
  },
  checkIn: function() {
    return this.hasOne(CheckIn);
  }
});

/**
 * Finds a user by its ID, joining in its related roles
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
User.findById = function(id) {
  return User.where({
    id: id
  })
    .fetch({
      withRelated: [ 'roles' ]
    });
};

User.findByGitHubHandle = (handle) => User.where({
  github_handle: handle
})
  .fetch({
    withRelated: [ 'roles' ]
  });

/**
 * Finds a user by its email address
 * @param  {String}                     email the email address
 * @return {Promise<User>}      the found user, or null
 */
User.findByEmail = function(email) {
  email = email.toLowerCase();
  return User.where({
    email: email
  })
    .fetch({
      withRelated: [ 'roles' ]
    });
};

/**
 * Creates a new user with the specified parameters and role. The role will be
 * set to active if user creation succeeds. Validation is performed on-save only
 * @param  {String} email    the user's email
 * @param  {String} password the user's raw password
 * @param  {String}	role the string representation of a role from utils.roles (optional)
 * @return {Promise<User>}	 the User object with the related roles joined-in (if any)
 */
User.create = function(email, password, role) {
  const user = User.forge({
    email: email
  });
  const userRole = UserRole.forge({
    role: role,
    active: true
  });

  if (!role) {
    // No roles were provided, so create the User
    return user.setPassword(password)
      .then((result) => result.save());
  }

  return User
    .transaction((t) => user.setPassword(password)
      .then((result) => result.save(null, {
        transacting: t
      }))
      .tap(() => {
        userRole.set({
          userId: user.get('id')
        });
        return userRole.save(null, {
          transacting: t
        });
      })
      .then((user) => User.where({
        id: user.get('id')
      })
        .fetch({
          withRelated: [ 'roles' ],
          transacting: t
        })));
};

/**
 * Securely sets a user's password without persisting any changes
 * @param {String} password a secure password of up to fifty characters
 * @return {Promise<User>} a Promise resolving to the updated User model
 */
User.prototype.setPassword = function(password) {
  return bcrypt
    .hashAsync(password, SALT_ROUNDS)
    .bind(this)
    .then(function(p) {
      return _Promise.resolve(this.set({
        password: p
      }));
    });
};

/**
 * Retrieves a role from the roles field.
 * @param  {String}	role the string representation of a role from utils.roles
 * @return {UserRole}	 the desired role, or undefined
 */
User.prototype.getRole = function(role) {
  return _.find(this.related('roles')
    .models, (roleInUser) => roleInUser.get('role') === role);
};

/**
 * Determines whether or not this user has the specified role
 * @param  {String}	role the string representation of a role from utils.roles
 * @param  {Boolean} activeOnly whether or not the role must be active (default true)
 * @return {Boolean}	  whether or not the user has the role
 * @throws {TypeError}	  when the user is missing its related roles key
 */
User.prototype.hasRole = function(role, activeOnly) {
  if (_.isUndefined(this.related('roles'))) {
    throw new TypeError('The related roles were not fetched with this User');
  }

  const roleMatch = {
    'role': role
  };
  if (_.isUndefined(activeOnly) || activeOnly) {
    roleMatch.active = 1;
  }

  return _.some(this.related('roles')
    .toJSON(), roleMatch);
};

/**
 * The plural form of User#hasRole. Checks if the user has any of the provided roles.
 * @param  {Array}	roles an array of string representations of a role from utils.roles
 * @param  {Boolean} activeOnly whether or not the role must be active (default true)
 * @return {Boolean}	  whether or not the user has any of the specified roles
 * @throws TypeError	  when the user is missing its related roles key
 */
User.prototype.hasRoles = function(roles, activeOnly) {
  let found = false;
  _.forEach(roles, _.bind(function(role) {
    found = found || this.hasRole(role, activeOnly);
  }, this));

  return found;
};

/**
 * Securely determines whether or not a password matches this user's password
 * @param  {String}  password an input of arbitrarily-long length
 * @return {Promise} resolving to a Boolean representing the validity
 * of the provided password
 */
User.prototype.hasPassword = function(password) {
  return _Promise
    .bind(this)
    .then(function() {
      return bcrypt.compareAsync(password, this.get('password'));
    });
};

User.prototype.setContactInfo = function(newEmail) {
  this.set({
    email: newEmail
  });

  return this.save();
};

/**
 * Serializes this User
 * @return {Object} the serialized form of this User
 */
User.prototype.serialize = function() {
  return _.omit(this.attributes, [ 'password' ]);
};

module.exports = User;
