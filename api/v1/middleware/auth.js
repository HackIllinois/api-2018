var AuthService = require('../services/AuthService');
var config = require('../../config');
var errors = require('../errors');

var AUTH_HEADER = config.auth.header;

module.exports = function (req, res, next) {
	var auth = req.header(AUTH_HEADER);

	if (!auth)
		return next();

	AuthService.verify(auth)
		.then(function (decoded) {
			req.auth = decoded;
			next();
		})
		.catch(errors.UnprocessableRequestError, function (error) {
			var message = "The provided token was invalid (" +
				error.message + ")";
			var source = AUTH_HEADER;

			next(new errors.InvalidHeaderError(message, source));
		});
};
