var Promise = require('bluebird');

var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var _ = require('lodash');

var config = require('../../config');
var errors = require('../errors');
var logger = require('../../logging');

var JWT_SECRET = config.auth.secret;
var JWT_CONFIG = {
  expiresIn: config.auth.expiration
};

function _issue(payload, subject) {
	var parameters = _.clone(JWT_CONFIG);
	if (arguments.length > 1) {
		parameters.subject = subject;
	}

	return jwt.signAsync(payload, JWT_SECRET, parameters);
}

module.exports.issueForUser = function (user, password) {
	return user
		.hasPassword(password)
		.then(function (result) {
			if (!result) {
				var message = "The provided password was incorrect";
				var source = "password";
				throw new errors.InvalidParameterError(message, source);
			}

			var subject = user.id.toString();
			var payload = {
				email: user.email,
				role: user.role
			};

			return _issue(payload, subject);
		});
};

module.exports.verify = function(token) {
	return jwt.verifyAsync(token, JWT_SECRET)
		.catch(jwt.JsonWebTokenError, function (error) {
			var message = error.message;
			throw new errors.UnprocessableRequestError(message);
		});
};
