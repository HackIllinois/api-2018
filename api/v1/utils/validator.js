var checkit = require('checkit')
var _ = require('lodash')
var _Promise = require('bluebird')

module.exports.nestedValidator = function(validations){
  return function(value){
    return checkit(validations).run(value);
  };
}

module.exports.arrayValidator = function(validator){
  return function(value){
    return _Promise.all(_.map(value, validator))
    .then(function(value){
      return true;
    });
  }
}
