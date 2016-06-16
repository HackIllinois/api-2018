var Checkit = require('checkit');
var _ = require('lodash');

var InvalidParameterError = require('../errors/InvalidParameterError');
var User = require('../models/User');
var utils = require('../utils');

module.exports.createUser = function(email, password, role) {
	email = email.toLowerCase();

	var user = User.forge({ email: email, password: password, role: role });
	return user.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return User.query().where({ email: email }).select();
		})
		.then(function (result) {
			if (!_.isEmpty(result)) {
				var errorDetail = "A user with the given email already exists";
				var errorSource = "email";
				throw new InvalidParameterError(errorDetail, errorSource);
			}

			return user.save();
		});
};
