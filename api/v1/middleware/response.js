var logUtils = require('../utils/logs');

module.exports = function (req, res, next) {
	if (!res.headersSent) {
		// we only have things to do if middleware further upstream
		// has not already responded
		var response = {
			meta: (res.meta) ? res.meta : null,
			data: (res.body) ? res.body : {}
		};

		res.json(response);
	}

	logUtils.logResponse(req, res);
	next();
};
