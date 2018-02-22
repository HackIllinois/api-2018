const Checkit = require('checkit');
const _Promise = require('bluebird');
const _ = require('lodash');

const User = require('../models/User');
const UserRole = require('../models/UserRole');
const errors = require('../errors');
const utils = require('../utils');
const roles = require('../utils').roles;

const ROLE_VALUE_MAP = {"ADMIN":2, "STAFF":1, "SPONSOR":0, "MENTOR":0, "VOLUNTEER":0, "ATTENDEE":0};

function maxRole(userRoles) {
  let max = 0;
  userRoles.forEach((roleObj) => {
    if(ROLE_VALUE_MAP[roleObj.role] > max) {
      max = ROLE_VALUE_MAP[roleObj.role];
    }
  });
  return max;
}

/**
 * Creates a user of the specified role. When a password is not specified, a
 * password will be generated for it
 * @param  {String} email the email identifying the user
 * @param  {String} password the password associated with the user (optional)
 * @param  {String} role a role to assign to the user
 * @return {Promise} resolving to the newly-created user
 * @throws InvalidParameterError when a user exists with the specified email
 */
module.exports.createUser = (email, password, role) => {

  email = email.toLowerCase();
  const storedPassword = (password) ? password : utils.crypto.generatePassword();
  const user = User.forge({
    email: email,
    password: storedPassword
  });
  return user
    .validate()
    .catch(Checkit.Error, utils.errors.handleValidationError)
    .then(() => User.create(email, storedPassword, role))
    .then((result) => {
      if (_.isUndefined(password) || _.isNull(password)) {
        // TODO: send user an email requiring a password reset when
        // the password is automatically generated
      }

      return _Promise.resolve(result);
    })
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('A user with the given email already exists', 'email')
    );
};

module.exports.createGitHubUser = (email, handle) => {
  email = email.toLowerCase();
  const user = User.forge({
    email: email,
    githubHandle: handle
  });

  return user
  .validate()
  .catch(Checkit.Error, utils.errors.handleValidationError)
  .then(() => user.save());
};

/**
 * Finds a user by querying for the given ID
 * @param  {Number} id the ID to query
 * @return {Promise} resolving to the associated User model
 * @throws {NotFoundError} when the requested user cannot be found
 */
module.exports.findUserById = (id) => User
    .findById(id)
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'A user with the given ID cannot be found';
        const source = 'id';
        throw new errors.NotFoundError(message, source);
      }

      return _Promise.resolve(result);
    });

/**
 * Finds a user by querying for the given email
 * @param  {String} email the email to query
 * @return {Promise} resolving to the associated User model
 * @throws {NotFoundError} when the requested user cannot be found
 */
module.exports.findUserByEmail = (email) => User
    .findByEmail(email)
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'A user with the given email cannot be found';
        const source = 'email';
        throw new errors.NotFoundError(message, source);
      }
      return _Promise.resolve(result);
    });

/**
 * Finds a user by querying for the given github handle
 * @param  {String} github the github handle to query
 * @return {Promise} resolving to the associated User model
 * @throws {NotFoundError} when the requested user cannot be found
 */
module.exports.findUserByGitHubHandle = (handle) => User
    .findByGitHubHandle(handle)
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'A user with the given github cannot be found';
        const source = 'handle';
        throw new errors.NotFoundError(message, source);
      }
      return _Promise.resolve(result);
    });

/**
 * Verifies that the provided password matches the user's password
 * @param  {User} user a User model
 * @param  {String} password the value to verify
 * @return {Promise} resolving to the validity of the provided password
 * @throws {InvalidParameterError} when the password is invalid
 */
module.exports.verifyPassword = (user, password) => user
    .hasPassword(password)
    .then((result) => {
      if (!result) {
        const message = 'The provided password is incorrect';
        const source = 'password';
        throw new errors.InvalidParameterError(message, source);
      }

      return _Promise.resolve(true);
    });

/**
 * Resets the user's password and saves it.
 * @param  {User} user a User model
 * @param  {String} password the password to change to
 * @return {Promise} resolving to the new User model
 */
module.exports.resetPassword = (user, password) => user
    .setPassword(password)
    .then((updated) => updated.save());

/**
 * Adds role to a user
 * @param  {User} user assigning new role
 * @param  {User} assignedUser the assigned User's model
 * @param  {Role} newRole the new role
 * @param  {User} originUser the original user to determine if impersonated
 * @return {Boolean} whether user can assign new role to assignedUser
 */
module.exports.canAssign = (user, assignedUser, newRole, originUser) => {
  let maxUserRole = maxRole(user.related('roles').toJSON());
  let maxAssigneeRole = maxRole(assignedUser.related('roles').toJSON());

  return maxUserRole > ROLE_VALUE_MAP[newRole]
      && maxUserRole > maxAssigneeRole
      && _.isUndefined(originUser)
      && (maxAssigneeRole > 0 || assignedUser.hasRole(roles.VOLUNTEER));
};

/**
 * Adds role to a user
 * @param  {User} user a User model
 * @param  {String} role a role to assign to the user
 * @param {Boolean} active a boolean whether new role should be active
 * @return {UserRole} the updatedUserRole
 */
module.exports.addRole = (user, role, active) => UserRole
    .addRole(user, role, active)
    .then((updatedUser) => {
      return updatedUser;
    });

module.exports.updateContactInfo = (user, newEmail) => {
  if(!_.isNull(user.get('password'))) {
    const message = 'Cannot update the contact info of a Basic user';
    const source = 'user';
    throw new errors.UnprocessableRequestError(message, source);
  }

  return user.setContactInfo(newEmail);
};
