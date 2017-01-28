/* jshint esversion: 6 */

var inflection = require('inflection');
var _ = require('lodash');

module.exports.format = function (target) {
	if (_.isObject(target)) {
		return _.mapKeys(target, (v, k) => inflection.underscore(k, true));
	}
	if (_.isArray(target)) {
		return _.map(target, (v) => _.isString(v) ? inflection.underscore(v, true) : v);
	}
	return _.isString(v) ? inflection.underscore(target, true) : target;
};

module.exports.parse = function (target) {
	if (_.isObject(target)) {
		return _.mapKeys(target, (v, k) => inflection.camelize(k, true));
	}
};
