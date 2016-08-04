var Promise = require('bluebird');
var Checkit = require('checkit');

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
