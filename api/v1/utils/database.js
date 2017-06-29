/* jshint esversion: 6 */

const inflection = require('inflection');
const _ = require('lodash');

module.exports.format = (target) => {
  if (_.isObject(target)) {
    return _.mapKeys(target, (v, k) => inflection.underscore(k, true));
  }
  if (_.isArray(target)) {
    return _.map(target, (v) => _.isString(v) ? inflection.underscore(v, true) : v);
  }
  return _.isString(target) ? inflection.underscore(target, true) : target;
};

module.exports.parse = (target) => {
  if (_.isObject(target)) {
    return _.mapKeys(target, (v, k) => inflection.camelize(k, true));
  }
};
