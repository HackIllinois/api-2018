/* jshint esversion: 6 */

var inflection = require('inflection');
var _ = require('lodash');

var databaseManager = require('../managers/databaseManager');
var bookshelf = databaseManager.instance();
var Model = bookshelf.Model.extend({ });

Model.prototype.format = function (attrs) {
	return _.mapKeys(attrs, (v, k) => inflection.underscore(k, true));
};

Model.prototype.parse = function (attrs) {
	return _.mapKeys(attrs, (v, k) => inflection.camelize(k, true));
};

module.exports = Model;
