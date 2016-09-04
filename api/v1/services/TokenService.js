/* jshint esversion: 6 */

var Token = require('../models/Token');
var config = require('../../config');
var logger = require('../../logging');
var errors = require('../errors');
var utils = require('../utils');

const TOKEN_NOT_FOUND_ERROR = "The supplied token does not exist";
const TOKEN_SCOPE_INVALID_ERROR = "An invalid or non-existent scope was supplied";

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
	if (!(scope in config.token.expiration)) {
		throw new TypeError(TOKEN_SCOPE_INVALID_ERROR);
	}

	return Token
		.findByValue(value)
		.then(function(result) {
			if (!result) {
				throw new errors.NotFoundError(TOKEN_NOT_FOUND_ERROR);
			}

			var expiration = utils.time.toMilliseconds(config.token.expiration[scope]);
			var tokenExpiration = Date.parse(result.get('created')) + expiration;
			if (tokenExpiration < Date.now())
			{
				// Invalid token (expired)
				result.destroy();
				return Promise.reject(new errors.TokenExpirationError());
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
	var userId = user.get('id');

	return Token
		.where({user_id: userId, type: scope}).fetchAll()
		.then(function(tokens) {
			return tokens.invokeThen('destroy')
				.then(function() {
					var token = Token.forge({type: scope, value: tokenVal, user_id: userId});
					return token.save().then(function () { return tokenVal; });
				});
		});
};
