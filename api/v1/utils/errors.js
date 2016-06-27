var InvalidParameterError = require('../errors/InvalidParameterError');

/**
 * Re-throws a Checkit validation error as an Invalid parameter error
 * @param  {Checkit.Error} error the error to re-throw
 * @throws {InvalidParameterError} the re-thrown error
 */
module.exports.handleValidationError = function (error) {
	var errorSource = error.keys()[0];
	var errorDetail = error.errors[errorSource].message;

	throw new InvalidParameterError(errorDetail, errorSource);
};
