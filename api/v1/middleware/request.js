const CheckitError = require('checkit')
	.Error;

const errorUtils = require('../utils/errors');

module.exports = function(Request) {
	return (req, res, next) => {
		if (!Request) {
			return next();
		}

		const request = new Request(req.headers, req.body);
		request.validate()
			.then(() => {
				req.body = request.body();

				return next();
			})
			.catch(CheckitError, errorUtils.handleValidationError)
			.catch((error) => {
				return next(error);
			});
	};
};
