var ApiError = require('../errors/ApiError');
var logger = require('../../logging');

module.exports = function (err, req, res, next) {
	if (!(err instanceof Error)) {
		logger.info("caught error of unknown type");
		logger.error(err);

		err = new ApiError();
	}
	else if (!err.isApiError) {
		logger.info("caught unhandled internal error");
		logger.error(err.stack);

		err = new ApiError();
	}

	var response = {
		meta: null,
		error: err.toJSON()
	};

	res.status(err.status).json(response);
};
