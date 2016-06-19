var errors = require('../errors');
var AuthService = require('../services/AuthService');
var UserService = require('../services/UserService');

var router = require('express').Router();

function _issueByEmail(email) {
	return UserService
		.findUserByEmail(email)
		.then(function (user) {
			return AuthService.issueForUser(user);
		});
}

function createToken (req, res, next) {
	_issueByEmail(req.body.email)
		.then(function (auth) {
			res.body = {};
			res.body.auth = auth;

			next();
		})
		.catch(function (error) {
			next(error);
		});
}

function refreshToken (req, res, next) {
	if (!req.auth) {
		var message = "A refresh token cannot be issued without a valid token";
		return next(new errors.InvalidHeaderError(message));
	}

	_issueByEmail(req.auth.email)
		.then(function (auth) {
			res.body = {};
			res.body.auth = auth;

			next();
		})
		.catch(function (error) {
			next(error);
		});
}

router.post('', createToken);
router.get('/refresh', refreshToken);

module.exports.createToken = createToken;
module.exports.router = router;
