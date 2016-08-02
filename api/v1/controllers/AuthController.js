const MINIMUM_PASSWORD_LENGTH = 8;  // Default minimum length for password

var Promise = require('bluebird');

var config = require('../../config');
var errors = require('../errors');
var utils = require('../utils');
var scopes = utils.scopes;
var mail = utils.mail;
var AuthService = require('../services/AuthService');
var UserService = require('../services/UserService');
var MailService = require('../services/MailService');
var config = require('../../config');

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

function requestPasswordReset (req, res, next) {
	var userEmail = req.query.email;

	UserService
		.findUserByEmail(userEmail)
		.then(function (user){
			return AuthService.generateToken(user, scopes.AUTH);
		})
		.then(function (tokenVal){
			//TODO: Determine exact url route for reset page
			tokenURL = (config.isDevelopment ? "localhost:8080/" : "hackillinois.org/") + "v1/auth/resetpage?token=" + tokenVal;
			var substitutions = {'resetURL': tokenURL};
			return MailService.send(userEmail, mail.templates.passwordReset, substitutions);
		})
		.then(function(){
			res.body = {};
			next();
			return null;
		})
		.catch(function (error){
			next(error);
			return null;
		});
}

function passwordReset(req, res, next) {
	// MARK - Should be able to remove this and let middleware handle the requirements
	/* 
	if (req.body.password.length < MINIMUM_PASSWORD_LENGTH)
	{
		var message = 'Password must be at least ' + MINIMUM_PASSWORD_LENGTH + ' characters long';
		next(new errors.InvalidParameterError(message, 'password'));
		return;
	}
	*/

	AuthService
		.findTokenByValue(req.body.token)
		.then(function (token) {
			var tokenExpire = Date.parse(token.get('created')) + config.tokenExpiration.AUTH;
			if (tokenExpire < Date.now())
			{
				// Invalid token (expired)
				token.destroy().then(function () {
					var message = 'Cannot reset password: current token is expired.' +
						    ' Please request a new token via API';
					return next(new errors.TokenExpirationError(message));
				});
			}
			else
			{
				AuthService
					.resetPassword(token, req.body.password)
					.then(function (user) {
						return AuthService
							.issueForUser(user)
							.then(function (auth) {
								// remove token before issuing
								token.destroy();

								res.body = {};
								res.body.auth = auth;
								next();
								return null;
							});
					});
			}
		})
		.catch(function (error) {
			next(error);
			return null;
		});
};


router.post('', createToken);
router.get('/refresh', refreshToken);
router.get('/reset', requestPasswordReset);
router.post('/reset', passwordReset);

module.exports.createToken = createToken;
module.exports.router = router;
