var AuthService = require('../services/AuthService');
var errors = require('../errors');

// TODO put this in global config
var AUTH_HEADER = 'Authorization';

module.exports = function (req, res, next) {
	var auth = req.header(AUTH_HEADER);

	if (!auth)
		next();

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
