var Promise = require('bluebird');

var Model = require('./Model');
var User = require('./User');
var Crypto = require('../utils/crypto');

const PASSWORD_VALIDATION = 'minlength:' + Crypto.PASSWORD_LENGTH;

var Token = Model.extend({
	tableName: 'tokens',
	idAttribute: 'id',
	hasTimestamps: ['created'],
	user: function(){
		return this.belongsTo(User, 'user_id');
	},
	validations: {
		value: ['required', 'string', PASSWORD_VALIDATION]
		// TODO: Add the reference to user as a requirement
	}
});

module.exports = Token;

/**
 * Finds a token given the Token value
 * @param {String|Number} value The Token's value
 * @return {Promise} resolving to the associated Token Model
 * @throws {NotFoundError} when the requested token cannot be found
 */
Token.findByValue = function(value) {
	return Token
		.where({ value: value }).fetchOne()  // Should only be one token available
		.then(function(result) {
			if (!result) {
				var message = "Could not find the provided token to reset password";
				var source = "value";
				throw new errors.InvalidParameterError(message, source);
			}
			// TODO: Check expiry
			// && Throw error if the token has expired already
			return Promise.resolve(result);
		});
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
	var user = User.findById(this.get('user'));
	return user.setPassword(password).save();
};

module.exports = Token;
