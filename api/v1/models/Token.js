var Promise = require('bluebird');

var Model = require('./Model');
var User = require('./User');
var Crypto = require('../utils/crypto');

var Token = Model.extend({
	tableName: 'tokens',
	idAttribute: 'id',
	hasTimestamps: ['created'],
	user: function(){
		return this.belongsTo(User, 'user_id');
	},
	validations: {
		value: ['required', 'string']
		// TODO: Add the reference to user as a requirement
	}
});

/**
 * Finds a token given the Token value
 * @param {String|Number} value The Token's value
 * @return {Promise} resolving to the associated Token Model
 * @throws {NotFoundError} when the requested token cannot be found
 */
Token.findByValue = function(value) {
	return this.collection().query({ where: { value: value }}).fetchOne();
};

/**
 * Securely sets a user's password persisting any changes
 * @param {String} password The new password to set of arbiturary length
 * @return {Promise} resolving to the associated User model
 */
Token.prototype.resetUserPassword = function(password) {
	/*
	 * TODO: Validate current Token before proceeding
	 * Check for expiration
	 */
	var id = this.get('userId');
	return User
		.findById(id)
		.then(function (user) {
			return user.setPassword(password).then(function (updatedUser) {
				return updatedUser.save();
			});
		});
};

module.exports = Token;
