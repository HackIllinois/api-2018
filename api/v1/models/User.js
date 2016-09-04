/* jshint esversion: 6 */

var _Promise = require('bluebird');
var bcrypt = _Promise.promisifyAll(require('bcrypt'));
var _ = require('lodash');

var crypto = require('../utils/crypto');
var roles = require('../utils/roles');

const SALT_ROUNDS = 12;

var Model = require('./Model');
var User = Model.extend({
	tableName: 'users',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		email: ['required', 'email'],
		password: ['required', 'string', 'minLength:8'],
		role: ['required', 'string', roles.verifyRole]
	}
});

/**
 * Finds a user by its email address
 * @param  {String} 			email the email address
 * @return {Promise<User>}      the found user, or null
 */
User.findByEmail = function (email) {
	email = email.toLowerCase();
	return this.collection().query({ where: { email: email } }).fetchOne();
};

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
			return _Promise.resolve(this.set({ password: p }));
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
	return _Promise
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
