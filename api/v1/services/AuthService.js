var Promise = require('bluebird');

var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var logger = require('winston');
var _ = require('lodash');

var errors = require('../errors');

// TODO handle all of this in global config
var JWT_SECRET = process.env.MASTER_SECRET || 'NONE';
var JWT_CONFIG = {
  expiresIn: "7d"
};

// keep this here until we have the gobal config set up
if (JWT_SECRET == 'NONE') {
	logger.warn("the default JWT secret is in use!");
}

module.exports.issue = function(payload, subject) {
	var parameters = _.clone(JWT_CONFIG);
	if (arguments.length > 1) {
		parameters.subject = subject;
	}

	return jwt.signAsync(payload, JWT_SECRET, parameters);
};

module.exports.issueForUser = function (user) {
	var subject = user.id.toString();
	var payload = {
		email: user.email,
		role: user.role
	};

	return module.exports.issue(payload, subject);
};

module.exports.verify = function(token) {
	return jwt.verifyAsync(token, JWT_SECRET)
		.catch(jwt.JsonWebTokenError, function (error) {
			var message = error.message;
			throw new errors.UnprocessableRequestError(message);
		});
};
