var InvalidParameterError = require('../errors/InvalidParameterError');
var ErrorConstants = require('../errors/Constants');

/**
 * Re-throws a Checkit validation error as an Invalid parameter error
 * @param  {Checkit.Error} error the error to re-throw
 * @throws {InvalidParameterError} the re-thrown error
 */
module.exports.handleValidationError = function(error) {
    var errorKey = error.keys()[0];
    var specificError = error.errors[errorKey];

    var errorDetail = specificError.message;
    var errorSource;
    while (specificError.key) {
    // find the most-complete error source in the error stack
        errorSource = specificError.key;
        specificError = (specificError.errors) ? specificError.errors[0] : undefined;
    }

    throw new InvalidParameterError(errorDetail, errorSource);
};

module.exports.DuplicateEntryError = function(error) {
    return error.code === ErrorConstants.DupEntry;
};

module.exports.handleDuplicateEntryError = function(message, source) {
    return function() {
        throw new InvalidParameterError(message, source);
    };
};
