var errors = require('../errors');
var UserService = require('../services/UserService');
var AuthService = require('../services/AuthService');

var middleware = require('../middleware');
var roles = require('../utils/roles');

var router = require('express').Router();

function isRequester(req) {
	return parseInt(req.auth.sub) == req.params.id;
}

function createHacker (req, res, next) {
	if (req.body.password !== req.body.confirmedPassword){
		var message = "Passwords do not match";
		var source = "confirmedPassword";

		return next(new errors.InvalidParameterError(message, source));
	}

	UserService
		.createUser(req.body.email, req.body.password, 'HACKER')
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

function getUser (req, res, next) {
	var id = req.params.id;

	UserService
		.findUserById(id)
		.then(function (user) {
			res.body = user.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

router.post('', createHacker);
router.get('/:id', middleware.permission(roles.ORGANIZERS, isRequester), getUser);

module.exports.createHacker = createHacker;
module.exports.router = router;
