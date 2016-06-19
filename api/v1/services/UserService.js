var Checkit = require('checkit');
var Promise = require('bluebird');
var _ = require('lodash');

var User = require('../models/User');
var errors = require('../errors');
var utils = require('../utils');

function _findUserByEmail(email) {
	if (email) {
		email = email.toLowerCase();
		return User.query().where({ email: email }).select();
	}

	return Promise.resolve([]);
}

module.exports.createUser = function (email, password, role) {
	email = email.toLowerCase();
	password = (password) ? password : utils.crypto.generatePassword();
	var user = User.forge({ email: email, password: password, role: role });

	return user
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return _findUserByEmail(email);
		})
		.then(function (result) {
			if (!_.isEmpty(result)) {
				var message = "A user with the given email already exists";
				var source = "email";
				throw new errors.InvalidParameterError(message, source);
			}

			return user.setPassword(password);
		})
		.then(function () {
			// TODO: add user to mailing list
			return user.save();
		});
};

module.exports.findUserByEmail = function (email) {
	return _findUserByEmail(email)
		.then(function (result) {
			if (_.isEmpty(result)) {
				var message = "A user with the given email cannot be found";
				var source = "email";
				throw new errors.NotFoundError(message, source);
			}

			return Promise.resolve(_.head(result));
		});
};
