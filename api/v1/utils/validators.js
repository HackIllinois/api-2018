var checkit = require('checkit');
var _ = require('lodash');
var _Promise = require('bluebird');

module.exports.nested = function(validations, parentName) {
    return function(value) {
        return checkit(validations)
			.run(value)
			.catch(checkit.Error, function(error) {
    var specificError = error.errors[error.keys()[0]];
    specificError.key = parentName + '.' + specificError.key;

    throw specificError;
});
    };
};

module.exports.array = function(validator) {
    return function(value) {
        return _Promise.all(
      _.map(value, validator))
			.then(function() {
    return true;
});
    };
};
