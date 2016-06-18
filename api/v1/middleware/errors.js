var ApiError = require('../errors/ApiError');

function marshalError(error) {
	return error.toJSON();
}

module.exports = function (err, req, res, next) {
	if (!(err instanceof Error)) {
		console.log("Caught error of uknown type:");
		console.log(err);

		err = new ApiError();
	}
	else if (!err.isApiError) {
		console.log(err.stack);

		err = new ApiError();
	}

	var response = {
		meta: null,
		error: marshalError(err)
	};

	res.json(response);
};
