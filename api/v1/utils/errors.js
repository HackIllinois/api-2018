var InvalidParameterError = require('../errors/InvalidParameterError');

module.exports.handleValidationError = function (error) {
	var errorSource = error.keys()[0];
	var errorDetail = error.errors[errorSource].message;

	throw new InvalidParameterError(errorDetail, errorSource);
};
