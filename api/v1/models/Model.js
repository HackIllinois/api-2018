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
 * Produces datastore transaction
 * @param  {Function} callback	method to start transaction
 * @return {Promise} 			the result of the callback
 */
Model.transaction = function (callback) {
	return bookshelf.transaction(callback);
};

/**
 * Fetches a model by its ID
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
Model.findById = function (id) {
	var queryWhere = {};
	// queryWhere[this.idAttribute] = id;
	// TODO: Resolve temporary fix
	queryWhere['id'] = id;
	return this.collection().query({ where: queryWhere }).fetchOne();
};

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
