var Token = require('../models/Token');
var config = require('../../config');
var logger = require('../../logging');

/**
 * Finds a token given the Token value
 * @param {String} value The Token's value
 * @param {String} scope The Scope the token is for
 * @return {Promise} resolving to the associated Token Model
 * @throws {NotFoundError} when the requested token cannot be found
 */
module.exports.findTokenByValue = function(value, scope) {
	return Token
		.findByValue(value)
		.then(function(result) {
			if (!result) {
				var message = "Could not find the provided token to reset password";
				var source = "token";
				throw new errors.InvalidParameterError(message, source);
			}

			// Provided logging for the DEFAULT case in case the developer did not intend to use it
			var defaultExpiration = function() {
				var warning = 'The scope currently accessed has the DEFAULT scope, '
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
				result.destroy().then(function () {
					var message = 'Provided token has expired.';
					throw new errors.TokenExpirationError(message);
				});
			}

			return Promise.resolve(result);
		});
};
