var Promise = require('bluebird');

var jwt = require('jsonwebtoken');
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

	return jwt.sign(payload, JWT_SECRET, parameters);
}

module.exports.issueForUser = function (user) {
	var subject = user.get("id").toString();
	var payload = {
		email: user.get("email"),
		role: user.get("role")
	};

	return Promise
		.try(function () {
			return Promise.resolve(_issue(payload, subject));
		});
};

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
