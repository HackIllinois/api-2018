var ApiError = require('../errors/ApiError');
var logger = require('../../logging');

function marshalError(error) {
	return error.toJSON();
}

module.exports = function (err, req, res, next) {
	if (!(err instanceof Error)) {
		logger.info("caught error of uknown type");
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
		error: marshalError(err)
	};

	res.status(err.status).json(response);
};
