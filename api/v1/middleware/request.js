var CheckitError = require('checkit').Error;

var endpoints = require('../endpoints');
var errors = require('../errors');
var errorUtils = require('../utils/errors');

module.exports = function(req, res, next) {
	var pathRequests = endpoints[req.path.replace(/\/+$/, "")];
	var MethodRequest = (pathRequests) ? pathRequests[req.method] : undefined;

	if (!MethodRequest)
		return next();

	var request = new MethodRequest(req.body);
	request.validate()
		.then(function (validated) {
			req.body = request.body;

			next();
			return null;
		})
		.catch(CheckitError, errorUtils.handleValidationError)
		.catch(function (error) {
			next(error);
			return null;
		});

};
