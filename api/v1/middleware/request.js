var CheckitError = require('checkit').Error;

var errors = require('../errors');
var errorUtils = require('../utils/errors');

module.exports = function (Request) {
	return function (req, res, next) {
		if (!Request) {
			return next();
		}

		var request = new Request(req.headers, req.body);
		request.validate()
			.then(function (validated) {
				req.body = request.body();

				next();
				return null;
			})
			.catch(CheckitError, errorUtils.handleValidationError)
			.catch(function (error) {
				next(error);
				return null;
			});
	};
};
