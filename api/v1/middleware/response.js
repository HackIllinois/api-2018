/* jshint esversion: 6 */

var _ = require('lodash');

var ApiError = require('../errors/ApiError');

function marshalBody(body) {
  if (typeof body !== 'object') {
	throw new Error("The response body must be an object or empty");
  }

  return body;
}

function marshalError(error) {
	return error.toJSON();
}

module.exports.handleResponse = function (req, res, next) {
	var response = {
		meta: (res.meta) ? res.meta : null,
		data: (res.body) ? marshalBody(res.body) : {}
	};

	res.json(response);
};

module.exports.handleError = function(err, req, res, next) {
	if (!(err instanceof Error)) {
		console.log("Caught error of uknown type:");
		console.log(err);

		err = ApiError();
	}
	else if (!err.isApiError) {
		console.log("Unhandled error:");
		console.log(err);

		err = ApiError();
	}

	var response = {
		meta: null,
		errors: marshalError(err)
	};

	res.json(response);
};
