const checkit = require('checkit');
const _ = require('lodash');
const _Promise = require('bluebird');

module.exports.nested = (validations, parentName) => function(value) {
  return checkit(validations)
      .run(value)
      .catch(checkit.Error, (error) => {
        const specificError = error.errors[error.keys()[0]];
        specificError.key = parentName + '.' + specificError.key;

        throw specificError;
      });
};

module.exports.array = (validator) => function(value) {
  return _Promise.all(
        _.map(value, validator))
      .then(() => true);
};

module.exports.in = (array, errorMessage) => (value) => {
  if (!_.includes(array, value)) {
    errorMessage = (errorMessage) ? errorMessage : 'is not a valid option ';
    throw new TypeError(value + ' ' + errorMessage);
  }

  return true;
};

module.exports.upTo = (condition, count, errorMessage) => (value) => {
  if (_.filter(value, condition).length > count) {
    errorMessage = (errorMessage) ? errorMessage : 'Too many values given';
    throw new TypeError(errorMessage);
  }

  return true;
};

module.exports.date = (date) => !!Date.parse(date);
