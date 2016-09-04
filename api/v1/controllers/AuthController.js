var bodyParser = require('body-parser');
var Promise = require('bluebird');

var config = require('../../config');
var errors = require('../errors');
var middleware = require('../middleware');
var utils = require('../utils');

var AuthService = require('../services/AuthService');
var TokenService = require('../services/TokenService');
var UserService = require('../services/UserService');

var logger = require('../../logging');

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

function passwordReset(req, res, next) {
	TokenService
		.findTokenByValue(req.body.token, utils.scopes.AUTH)
		.then(function (token) {
			token.destroy();
			return UserService.resetPassword(token.related('user'), req.body.password);
		})
		.then(function (user) {
			return AuthService.issueForUser(user);
		})
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

router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.post('', createToken);
router.get('/refresh', refreshToken);
router.post('/reset', passwordReset);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.createToken = createToken;
module.exports.router = router;
