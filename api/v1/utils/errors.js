const InvalidParameterError = require('../errors/InvalidParameterError');
const ErrorConstants = require('../errors/Constants');

/**
 * Re-throws a Checkit validation error as an Invalid parameter error
 * @param  {Checkit.Error} error the error to re-throw
 * @throws {InvalidParameterError} the re-thrown error
 */
module.exports.handleValidationError = (error) => {
  const errorKey = error.keys()[0];
  let specificError = error.errors[errorKey];

  const errorDetail = specificError.message;
  let errorSource;
  while (specificError.key) {
    // find the most-complete error source in the error stack
    errorSource = specificError.key;
    specificError = (specificError.errors) ? specificError.errors[0] : undefined;
  }

  throw new InvalidParameterError(errorDetail, errorSource);
};

module.exports.DuplicateEntryError = (error) => error.code === ErrorConstants.DupEntry;

module.exports.handleDuplicateEntryError = (message, source) => () => {
  throw new InvalidParameterError(message, source);
};
