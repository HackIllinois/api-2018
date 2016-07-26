var Promise = require('bluebird');

var jwt = require('jsonwebtoken');
var _ = require('lodash');

var utils = require('../utils');
var config = require('../../config');
var errors = require('../errors');
var logger = require('../../logging');
var Token = require('../models/Token');

var JWT_SECRET = config.auth.secret;
var JWT_CONFIG = {
  expiresIn: config.auth.expiration
};

/**
 * Issues an auth token using the provided payload and optional subject
 * @param  {Object} payload the content to claim in the token
 * @param  {String} subject the subject of the claim (optional, but recommended)
 * @return {String} an auth token representing a claim, expiring as defined
 * in the global configuration
 * @throws see JWT error documentation for possible errors
 */
function _issue(payload, subject) {
	var parameters = _.clone(JWT_CONFIG);
	if (arguments.length > 1) {
		parameters.subject = subject;
	}

	return jwt.sign(payload, JWT_SECRET, parameters);
}

/**
 * Issues a token for the parameterized suer
 * @param  {User} user the User model holding the information to claim
 * @return {Promise} resolving to the auth token
 */
module.exports.issueForUser = function (user) {
	var subject = user.get("id").toString();
	var payload = {
		email: user.get("email"),
		role: user.get("role")
	};

	return Promise
		.try(function () {
			// the JWT library behind _issue may thrown any number
			// of errors, which we do not want to propogate yet
			return Promise.resolve(_issue(payload, subject));
		});
};

/**
 * Verifies the parameterized token's signature and expiration
 * @param  {String} token an auth token
 * @return {Promise} resolving to the validity of the token, or a rejected
 * promise resolving to an UnprocessableRequestError
 */
module.exports.verify = function(token) {
	return Promise
		.try(function () {
			return Promise.resolve(jwt.verify(token, JWT_SECRET));
		})
		.catch(jwt.JsonWebTokenError, function (error) {
			var message = error.message;
			throw new errors.UnprocessableRequestError(message);
		});
};


/**
 * Generates a token.
 * @param {User} user The user object to create a reset token for.
 * @param {String} scope The scope to create the token for.
 * @return {Bool} Returns true on a successful token creation.
 */
module.exports.generateToken = function(user, scope){
	var tokenVal = utils.crypto.generateResetToken();
	var user_id = user.get('id');

	return Token
		.where({user_id: user_id}).fetchAll()
		.then(function(tokens) {
			return tokens.invokeThen('destroy')
				.then(function() {
					var token = Token.forge({type: scope, value: tokenVal, 'user_id': user_id});
					return token.save().then(function () { return true; });
				});
		});
};

/**
 * Finds a token given the Token ID
 * @param {String|Number} id The Token's ID
 * @return {Promise} resolving to the associated Token Model
 * @throws {NotFoundError} when the requested token cannot be found
 */
module.exports.findTokenById = function(id) {
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
 * Resets the User's password given that the token is the same as the one
 * generated when the user requests a password change
 * @param {String} token the Token user has obtained to reset password
 * @param {String} password the password the User would like to change it to
 * @return {Promise} resolving to the validity of the provided password
 * @throws {InvalidParameterError} when the requested token cannot be found
 */
module.exports.resetPassword = function(token, password) {
	/*
	 * TODO: Check if the token's ID is secure enough to
	 * allow the user to change the password.
	 * HINT: It's probably not enough...
	 */
	return Token
		.findTokenById(token)
		.then(function(result) {
			return Promise.resolve(result.resetUserPassword(password));
		});
};
