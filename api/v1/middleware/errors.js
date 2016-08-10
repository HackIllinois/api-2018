var errors = require('../errors');
var logger = require('../../logging');

module.exports = function (err, req, res, next) {
	if (!(err instanceof Error)) {
		logger.info("caught error of unknown type");
		logger.error(err);

		err = new errors.ApiError();
	}
	else if (err instanceof Error && err.status === 413) {
		// caught a body-parser entity length error
		err = new errors.EntityTooLargeError();
	}
	else if (err instanceof SyntaxError && err.status === 400) {
		// caught a body-parser formatting error
		// https://github.com/expressjs/body-parser/issues/122
		err = new errors.UnprocessableRequestError();
	}
	else if (!err.isApiError) {
		logger.info("caught unhandled error");
		logger.error(err.stack);

		err = new errors.ApiError();
	}

	var response = {
		meta: null,
		error: err.toJSON()
	};

	res.status(err.status).json(response);
};
