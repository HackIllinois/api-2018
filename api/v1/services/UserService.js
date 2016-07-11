var Checkit = require('checkit');
var Promise = require('bluebird');
var _ = require('lodash');

var User = require('../models/User');
var errors = require('../errors');
var utils = require('../utils');

/**
 * Finds a user by its email address
 * @param  {String} email the email to query
 * @return {Array} the possible (one) matching user, or an empty array
 */
function _findUserByEmail (email) {
	if (email) {
		email = email.toLowerCase();
		return User.query().where('email', email).select();
	}

	return Promise.resolve([]);
}

/**
 * Finds a user by its datastore ID
 * @param  {Number} id the ID to query
 * @return {Array} the possible (one) matching user, or an empty array
 */
function _findUserById (id) {
	if (id) {
		return User.query().where('id', id).select();
	}

	return Promise.resolve([]);
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
module.exports.createUser = function (email, password, role) {
	email = email.toLowerCase();
	password = (password) ? password : utils.crypto.generatePassword();
	var user = User.forge({ email: email, password: password, role: role });

	// TODO: send user an email requiring a password reset when
	// the password is automatically generated

	return user
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return _findUserByEmail(email);
		})
		.then(function (result) {
			if (!_.isEmpty(result)) {
				var message = "A user with the given email already exists";
				var source = "email";
				throw new errors.InvalidParameterError(message, source);
			}

			return user.setPassword(password);
		})
		.then(function () {
			// TODO: add user to mailing list
			return user.save();
		})
		.then(function (user) {
			return Promise.resolve(user);
		});
};

/**
 * Finds a user by querying for the given ID
 * @param  {Number} id the ID to query
 * @return {Promise} resolving to the associated User model
 * @throws {NotFoundError} when the requested user cannot be found
 */
module.exports.findUserById = function (id) {
	return _findUserById(id)
		.then(function (result) {
			if (_.isEmpty(result)) {
				var message = "A user with the given ID cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}

			return Promise.resolve(User.forge(_.head(result)));
		});
};

/**
 * Finds a user by querying for the given email
 * @param  {String} email the email to query
 * @return {Promise} resolving to the associated User model
 * @throws {NotFoundError} when the requested user cannot be found
 */
module.exports.findUserByEmail = function (email) {
	return _findUserByEmail(email)
		.then(function (result) {
			if (_.isEmpty(result)) {
				var message = "A user with the given email cannot be found";
				var source = "email";
				throw new errors.NotFoundError(message, source);
			}

			return Promise.resolve(User.forge(_.head(result)));
		});
};

/**
 * Verifies that the provided password matches that of the user's password
 * @param  {User} user a User model
 * @param  {String} password the value to verify
 * @return {Promise} resolving to the validity of the provided password
 * @throws {InvalidParameterError} when the password is invalid
 */
module.exports.verifyPassword = function (user, password) {
	return user
		.hasPassword(password)
		.then(function (result) {
			if (!result) {
				var message = "The provided password is incorrect";
				var source = "password";
				throw new errors.InvalidParameterError(message, source);
			}

			return Promise.resolve(true);
		});
};
