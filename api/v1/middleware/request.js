var _ = require('lodash');

var endpoints = require('../endpoints');
var errors = require('../errors');

function audit(req, required) {
	var data = req.body;
	var missingParameters = [];

	if (!data) {
		var errorDetail = 'The request body could not be parsed';
		throw new Errors.UnprocessableRequest(errorDetail, null);
	}

	_.forEach(required, function(requiredParameter) {
		if (_.isUndefined(data[requiredParameter]))
			missingParameters.push(requiredParameter);
	});

	if (missingParameters.length)
		throw new Errors.MissingParameter(null, missingParameters);
}

function marshal(req, allowed) {
  req.body = _.pick(req.body, allowed);
}

module.exports.handleRequest = function(req, res, next) {
	var pathParameters = endpoints[req.path];
	var endpointParameters = (pathParameters) ? pathParameters[req.method] : undefined;

	if (!endpointParameters)
		return next();

	var required = endpointParameters.required;
	var allowed = endpointParameters.allowed;

	audit(req, (required) ? required : []);
	marshal(req, (allowed) ? allowed : []);

	return next();
};
