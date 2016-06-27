module.exports = function (req, res, next) {
	var response = {
		meta: (res.meta) ? res.meta : null,
		data: (res.body) ? res.body : {}
	};

	res.json(response);
};
