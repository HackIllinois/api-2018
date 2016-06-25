/* jshint esversion: 6 */

var promise = require('bluebird');
var bcrypt = promise.promisifyAll(require('bcrypt'));
var _ = require('lodash');

var crypto = require('../utils/crypto');
var roles = require('../utils/roles');

const SALT_ROUNDS = 12;

/**
 * Validates whether or not a provided role is valid for a User model
 * @param  {String}  value the value to examine
 * @return {Boolean} true if the value is a valid role
 * @throws {TypeError} when value is not a valid role
 */
function hasValidRole(value) {
	if (roles.ALL.indexOf(value) < 0) {
		throw new TypeError(value + " is not a valid role");
	}

	return true;
}

var Model = require('./Model');
var User = Model.extend({
	tableName: 'users',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		email: ['required', 'email'],
		password: ['required', 'string', 'minLength:8'],
		role: ['required', 'string', hasValidRole]
	}
});

/**
 * Securely sets a user's password without persisting any changes
 * @param {String} password a secure password of arbitrarily-long length
 * @return {Promise} a Promise resolving to the updated User model
 */
User.prototype.setPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt
		.hashAsync(password, SALT_ROUNDS)
		.bind(this)
		.then(function (p) {
			return promise.resolve(this.set({ password: p }));
		});
};

/**
 * Securely determines whether or not a password matches this user's password
 * @param  {String}  password an input of arbitrarily-long length
 * @return {Promise} resolving to a Boolean representing the validity
 * of the provided password
 */
User.prototype.hasPassword = function (password) {
	password = crypto.hashWeak(password);
	return promise
		.bind(this)
		.then(function() {
			return bcrypt.compareAsync(password, this.get('password'));
		});
};

/**
 * Serializes this User
 * @return {Object} the serialized form of this User
 */
User.prototype.toJSON = function () {
	return _.omit(this.attributes, ['password']);
};

module.exports = User;
