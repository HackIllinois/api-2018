var Promise = require('bluebird');

var errors = require('../errors');
var utils = require('../utils');
var AuthService = require('../services/AuthService');
var UserService = require('../services/UserService');

var router = require('express').Router();

/**
 * Issues a token using the provided email address,
 * optionally checking a password against the associated
 * user's password
 * @param  {String} email    a user's email address
 * @param  {String} password the associated user's password (optional)
 * @return {Promise} a promise resolving to an auth token
 * @throws {NotFoundError} when there is no user associated with the email
 * @throws {InvalidParameterError} when the provided password is incorrect
 */
function _issueByEmail(email, password) {
	return UserService
		.findUserByEmail(email)
		.then(function (user) {
			if (!password) {
				return AuthService.issueForUser(user);
			}

			return UserService
				.verifyPassword(user, password)
				.then(function () {
					return AuthService.issueForUser(user);
				});
		});
}

function createToken (req, res, next) {
	// the requester must have a valid password to receive a new token
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

	// the requester's token must be valid and present, so we can re-issue
	// without requiring a password
	_issueByEmail(req.auth.email)
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

function requestPasswordReset (req, res, next) {
	var userEmail = req.query.email;

	UserService
		.findUserByEmail(userEmail)
		.then(function (user){
			var token = utils.crypto.generateResetToken();
			return AuthService.createNewPasswordToken(token, user.get('id'));
		})
		.then(function (status){
			res.body = {}
			res.body.status = status;
			next();
			return null;
		})
		.catch(function (error){
			next(error);
			return null;
		});
}


router.post('', createToken);
router.get('/refresh', refreshToken);
router.get('/reset', requestPasswordReset)

module.exports.createToken = createToken;
module.exports.router = router;
