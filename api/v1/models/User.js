var promise = require('bluebird');
var bcrypt = promise.promisifyAll(require('bcrypt'));
var crypto = require('../utils/crypto');

var SALT_ROUNDS = 12;

var Model = require('./Model');
var User = Model.extend({
	tableName: 'users',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		email: ['required', 'email'],
		password: ['required', 'string', 'minLength:8'],
		role: ['required', 'string']
	}
});

User.prototype.setPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt.hashAsync(password, SALT_ROUNDS).bind(this).then(function (p) {
		return promise.resolve(this.set({ password: p }));
	});
};

User.prototype.hasPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt.compareAsync(password, this.get('password'));
};

// example usage
// var test = User.forge({email: 'admin@example.com', role:'HACKER'});
// test.setPassword('password7').then(function (model) {
// 	return model.save();
// }).then(function() {
// 	return User.query().where({email: 'admin@example.com'}).select();
// }).then(function (r) {
// 	var u = User.forge(r[0], { parse: true });
// 	return u.hasPassword('password');
// }).then(function (r) {
// 	console.log(r);
// });

module.exports = User;
