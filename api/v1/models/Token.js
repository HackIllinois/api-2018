var Promise = require('bluebird');

var Model = require('./Model');
var User = require('./User');

var Token = Model.extend({
	tableName: 'tokens',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'userId']
	}
});

module.exports = Token;

/**
 * Finds a token given the Token ID
 * @param {String|Number} id The Token's ID
 * @return {Promise} resolving to the associated Token Model
 * @throws {NotFoundError} when the requested token cannot be found
 */
Token.findTokenById = function(id) {
	return Token
		.findById(id)
		.then(function(result) {
			if (!result) {
				var message = "Could not find the provided token to reset password";
				var source = "token";
				throw new errors.InvalidParameterError(message, source);
			}
			// TODO: Check expiry
			return Promise.resolve(result);
		});
};

/**
 * Securely sets a user's password without persisting any changes (see
 * User.prototype.setPassword) for the user associated with the token
 * @param {String} password The new password to set of arbiturary length
 * @return {Promise} resolving to the associated User model
 */
Token.prototype.resetUserPassword = function(password) {
	/*
	 * TODO: Validate current Token before proceeding
	 * Check for expiration
	 */
	var user = User.findById(this.get('userId'));
	return user.setPassword(password);
};
