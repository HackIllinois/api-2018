var CheckitError = require('checkit').Error;

var endpoints = require('../endpoints');
var errors = require('../errors');
var errorUtils = require('../utils/errors');

module.exports = function(req, res, next) {
	// we need to find whether or not this endpoint's method has a validating
	// request object mapped to it
	var pathRequests = endpoints[req.originalUrl.replace(/\/+$/, "")];
	var MethodRequest = (pathRequests) ? pathRequests[req.method] : undefined;

	// not all methods (or endpoints) define such an object
	if (!MethodRequest) {
		return next();
	}

	// the request we find is an object type, so we instantiate it
	// and then handle any validation errors before continuing
	var request = new MethodRequest(req.headers, req.body);
	request.validate()
		.then(function (validated) {
			req.body = request.body();

			next();
			return null;
		})
		.catch(CheckitError, errorUtils.handleValidationError)
		.catch(function (error) {
			next(error);
			return null;
		});

};
