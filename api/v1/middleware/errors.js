/* jshint esversion: 6 */

var errors = require('../errors');
var logUtils = require('../utils/logs');

const ERRORS = {
	UNCAUGHT: 'UNCAUGHT',
	CLIENT: 'CLIENT',
	UNKNOWN: 'UNKNOWN',
};

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
		logUtils.logError(req, err, null, ERRORS.UNKNOWN);
		err = new errors.ApiError();
	}
	else if (!err.isApiError) {
		logUtils.logError(req, err.stack, null, ERRORS.UNCAUGHT);
		err = new errors.ApiError();
	} else {
		logUtils.logError(req, err.message, err.status, ERRORS.CLIENT);
	}

	var response = {
		meta: null,
		error: err.toJSON()
	};

	res.status(err.status).json(response);
};
