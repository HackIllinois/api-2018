var Promise = require('bluebird');

var errors = require('../errors');
var AuthService = require('../services/AuthService');
var UserService = require('../services/UserService');

var router = require('express').Router();

function _issueByEmail(email, password) {
	if (!password && password !== null) {
		throw new TypeError("To issue a token by email without checking the " +
			"user's password, you must pass the password as the null type");
	}

	return UserService
		.findUserByEmail(email)
		.then(function (user) {
			if (!password)
				return AuthService.issueForUser(user);

			return UserService
				.verifyPassword(user, password)
				.then(function () {
					return AuthService.issueForUser(user);
				});
		});
}

function createToken (req, res, next) {
	_issueByEmail(req.body.email, req.body.password)
		.then(function (auth) {
			res.body = {};
			res.body.auth = auth;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function refreshToken (req, res, next) {
	if (!req.auth) {
		var message = "A refresh token cannot be issued without a valid token";
		return next(new errors.InvalidHeaderError(message));
	}

	_issueByEmail(req.auth.email, null)
		.then(function (auth) {
			res.body = {};
			res.body.auth = auth;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

router.post('', createToken);
router.get('/refresh', refreshToken);

module.exports.createToken = createToken;
module.exports.router = router;
