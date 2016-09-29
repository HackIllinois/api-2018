var AuthService = require('../services/AuthService');
var User = require('../models/User');
var config = require('../../config');
var errors = require('../errors');

var AUTH_HEADER = config.auth.header;

module.exports = function (req, res, next) {
	var auth = req.header(AUTH_HEADER);

	if (!auth) {
		return next();
	}

	return AuthService.verify(auth)
		.then(function (decoded) {
			// specifies that request supplied a valid auth token
			// (but not necessarily that the associated user data has been retrieved)
			req.auth = true;
			
			return User.findById(decoded.sub);
		})
		.then(function (user) {
			req.user = user;

			next();
			return null;
		})
		.catch(errors.UnprocessableRequestError, function (error) {
			var message = "The provided token was invalid (" +
				error.message + ")";
			var source = AUTH_HEADER;

			next(new errors.InvalidHeaderError(message, source));
			return null;
		});
};
