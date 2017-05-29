/* jshint esversion: 6 */

const errors = require('../errors');
const logUtils = require('../utils/logs');

module.exports = function (err, req, res, next) {
	if (err instanceof Error && err.status === 413) {
		// caught a body-parser entity length error
		err = new errors.EntityTooLargeError();
	}
	else if (err instanceof SyntaxError && err.status === 400) {
		// caught a body-parser formatting error
		// https://github.com/expressjs/body-parser/issues/122
		err = new errors.UnprocessableRequestError();
	}

	if (!(err instanceof Error)) {
		logUtils.logError(req, err, null, logUtils.errorTypes.UNKNOWN);
		err = new errors.ApiError();
	}
	else if (!err.isApiError) {
		logUtils.logError(req, err.stack, null, logUtils.errorTypes.UNCAUGHT);
		err = new errors.ApiError();
	} else {
		logUtils.logError(req, err.message, err.status, logUtils.errorTypes.CLIENT);
	}

	if (res.headersSent) {
		return next();
	}

	const response = {
		meta: null,
		error: err.toJSON()
	};

	return res.status(err.status).json(response);
};
