/* jshint esversion: 6 */

var promise = require('bluebird');
var bcrypt = promise.promisifyAll(require('bcrypt'));
var inflection = require('inflection');
var _ = require('lodash');

var databaseManager = require('../managers/databaseManager');
var crypto = require('../utils/crypto');

var SALT_ROUNDS = 12;

var bookshelf = databaseManager.instance();
var User = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: ['Created', 'Updated'],
	idAttribute: 'ID',
});

User.prototype.format = function (attrs) {
	return _
		.chain(attrs)
		.mapKeys(attrs, key => inflection.titleize(key))
		.mapKeys(attrs, key => inflection.underscore(key, true));
};

User.prototype.parse = function (attrs) {
	return _
		.chain(attrs)
		.mapKeys(attrs, key => inflection.camelize(key, true));
};

User.prototype.setPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt.hashAsync(password, SALT_ROUNDS).bind(this).then(function (p) {
		return promise.resolve(this.set('password', p));
	});
};

User.prototype.hasPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt.compareAsync(password, this.get('password'));
};

// TODO check the format/parse functions

module.exports = User;
