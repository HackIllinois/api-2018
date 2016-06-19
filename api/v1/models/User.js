var promise = require('bluebird');
var bcrypt = promise.promisifyAll(require('bcrypt'));
var _ = require('lodash');

var crypto = require('../utils/crypto');
var roles = require('../utils/roles');

var SALT_ROUNDS = 12;

function hasValidRole(value) {
	if (roles.ALL.indexOf(value) < 0)
		throw new Error(value + " is not a valid role");
}

var Model = require('./Model');
var User = Model.extend({
	tableName: 'users',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		email: ['required', 'email'],
		password: ['required', 'string', 'minLength:8'],
		role: ['required', 'string', hasValidRole]
	}
});

User.prototype.setPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt
		.hashAsync(password, SALT_ROUNDS)
		.bind(this)
		.then(function (p) {
			return promise.resolve(this.set({ password: p }));
		});
};

User.prototype.hasPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt.compareAsync(password, this.get('password'));
};

User.prototype.toJSON = function () {
	return _.omit(this.attributes, ['password']);
};

module.exports = User;
