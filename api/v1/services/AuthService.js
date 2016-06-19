var Promise = require('bluebird');
var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var logger = require('winston');

var errors = require('../errors');

// TODO handle all of this in global config
var JWT_SECRET = process.env.AUTH_SECRET || 'NONE';
var JWT_CONFIG = {
  expiresIn: "7d"
};

// keep this here until we have the gobal config set up
if (JWT_SECRET == 'NONE') {
	logger.warn("the default JWT secret is in use!");
}

module.exports.issue = function(payload, subject) {
	var parameters = new Map(JWT_CONFIG);
	if (arguments.length > 1) {
		parameters.subject = subject;
	}

	return jwt.signAsync(payload, JWT_SECRET, parameters);
};

module.exports.verify = function(token) {
	return jwt.verifyAsync(token, JWT_SECRET)
		.catch(jwt.JsonWebTokenError, function (error) {
			var message = error.message;
			throw new errors.UnprocessableRequestError(message);
		});
};
