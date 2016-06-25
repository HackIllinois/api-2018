var errors = require('../errors');
var UserService = require('../services/UserService');
var AuthService = require('../services/AuthService');

var middleware = require('../middleware');
var roles = require('../utils/roles');

var router = require('express').Router();

/**
 * Determines whether or not the requester is requesting its own
 * user information
 * @param  {Request}  req an Express request with auth and parameter information
 * @return {Boolean} whether or not the requester is requesting itself
 */
function isRequester(req) {
	return parseInt(req.auth.sub) == req.params.id;
}

function createHacker (req, res, next) {
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
