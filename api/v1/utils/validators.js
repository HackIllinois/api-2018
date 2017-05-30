const checkit = require('checkit');
const _ = require('lodash');
const _Promise = require('bluebird');

module.exports.nested = function(validations, parentName) {
	return function(value) {
		return checkit(validations)
			.run(value)
			.catch(checkit.Error, (error) => {
				const specificError = error.errors[error.keys()[0]];
				specificError.key = parentName + '.' + specificError.key;

				throw specificError;
			});
	};
};

module.exports.array = function(validator) {
	return function(value) {
		return _Promise.all(
      _.map(value, validator))
			.then(() => {
				return true;
			});
	};
};
