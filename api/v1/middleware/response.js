module.exports = function (req, res, next) {
	if (res.headersSent) {
		// middleware further upstream already responded, so we
		// have nothing to do here
		return next();
	}

	var response = {
		meta: (res.meta) ? res.meta : null,
		data: (res.body) ? res.body : {}
	};

	res.json(response);
};
