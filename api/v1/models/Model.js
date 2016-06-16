/* jshint esversion: 6 */

var checkit = require('checkit');
var inflection = require('inflection');
var _ = require('lodash');

var database = require('../managers/database');
var bookshelf = database.instance();
var Model = bookshelf.Model.extend({
	validations: {}
});

Model.prototype.initialize = function () {
	this.on('saving', this.validate);
};

Model.prototype.format = function (attrs) {
	return _.mapKeys(attrs, (v, k) => inflection.underscore(k, true));
};

Model.prototype.parse = function (attrs) {
	return _.mapKeys(attrs, (v, k) => inflection.camelize(k, true));
};

Model.prototype.validate = function () {
	return checkit(this.validations).run(this.attributes);
};

module.exports = Model;
