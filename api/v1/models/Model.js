/* jshint esversion: 6 */

var checkit = require('checkit');
var inflection = require('inflection');
var _ = require('lodash');

var database = require('../../database');
var bookshelf = database.instance();

var Model = bookshelf.Model.extend({
	// the default model has no validations, but more can be
	// added as desired
	validations: {}
});

/**
 * Initializes the model by setting up all event handlers
 */
Model.prototype.initialize = function () {
	this.on('saving', this.validate);
};

/**
 * Ensures keys being inserted into the datastore have the correct format
 * @param  {Object} attrs the attributes to transform
 * @return {Object}       the transformed attributes (underscored)
 */
Model.prototype.format = function (attrs) {
	return _.mapKeys(attrs, (v, k) => inflection.underscore(k, true));
};

/**
 * Ensures keys being retrieved from the datastore have the correct format
 * @param  {Object} attrs the attributes to transform
 * @return {Object}       the transformed attributes (camel-cased)
 */
Model.prototype.parse = function (attrs) {
	return _.mapKeys(attrs, (v, k) => inflection.camelize(k, true));
};

/**
 * Validates the attributes of this model based on the assigned validations
 * @return {Promise} resolving to the validity of the attributes, as decided by
 * the Checkit library
 */
Model.prototype.validate = function () {
	return checkit(this.validations).run(this.attributes);
};

module.exports = Model;
