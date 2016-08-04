var Token = require('../models/Token');
var config = require('../../config');
var logger = require('../../logging');
var errors = require('../errors');
var utils = require('../utils');

/**
 * Finds a token given the Token value
 * @param {String} value The Token's value
 * @param {String} scope The Scope the token is for
 * @return {Promise} resolving to the associated Token Model
 * @throws {NotFoundError} when the requested token cannot be found
 * @throws {TokenExpirationError} when the request token has expired
 * @throws {TypeError} when the scope was not found
 */
module.exports.findTokenByValue = function(value, scope) {
	return Token
		.findByValue(value)
		.then(function(result) {
			if (!result) {
				const message = "Could not find the provided token.";
				const source = "token";
				throw new errors.NotFoundError(message, source);
			}

			// Provided logging for the DEFAULT case in case the developer did not intend to use it
			var defaultExpiration = function() {
				const warning = 'The scope currently accessed has the DEFAULT scope, '
				    + 'you may have forgotten to create a new scope in config.js';
				logger.warn(warning);
				return config.token.expiration['DEFAULT'];
			};

			// Check expiration
			let expiration = config.token.expiration[scope.toUpperCase()]
						 || defaultExpiration();
			var tokenExpire = Date.parse(result.get('created')) + expiration;
			if (tokenExpire < Date.now())
			{
				// Invalid token (expired)
				result.destroy();
				const message = 'Requested token has expired.';
				return Promise.reject(new errors.TokenExpirationError(message));
			}

			return Promise.resolve(result);
		});
};

/**
 * Generates a token and deletes all existing tokens
 * with the same scope.
 * @param {User} user The user object to create a reset token for.
 * @param {String} scope The scope to create the token for.
 * @return {Promise<Bool>} Returns a Promise that resolves to
 *                         true on a successful token creation.
 */
module.exports.generateToken = function(user, scope){
	var tokenVal = utils.crypto.generateResetToken();
	var user_id = user.get('id');

	return Token
		.where({user_id: user_id, type: scope}).fetchAll()
		.then(function(tokens) {
			return tokens.invokeThen('destroy')
				.then(function() {
					var token = Token.forge({type: scope, value: tokenVal, 'user_id': user_id});
					return token.save().then(function () { return tokenVal; });
				});
		});
};


