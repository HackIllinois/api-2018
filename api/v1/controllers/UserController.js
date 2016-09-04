var bodyParser = require('body-parser');

var errors = require('../errors');
var services = require('../services');
var config = require('../../config');

var middleware = require('../middleware');
var scopes = require('../utils/scopes');
var mail = require('../utils/mail');
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

function createHackerUser (req, res, next) {
	services.UserService
		.createUser(req.body.email, req.body.password, 'HACKER')
		.then(function (user) {
			return services.AuthService.issueForUser(user);
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

function createAccreditedUser (req, res, next) {
	var requesterRole = req.auth.role;

	services.PermissionService
		.canCreateUser(requesterRole, req.body.role)
		.then(function (verified) {
			return services.UserService
				.createUser(req.body.email, req.body.password, req.body.role);
		})
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

function getUser (req, res, next) {
	var id = req.params.id;

	services.UserService
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

function requestPasswordReset (req, res, next) {
	var userEmail = req.body.email;

	services.UserService
		.findUserByEmail(userEmail)
		.then(function (user){
			return services.TokenService.generateToken(user, scopes.AUTH);
		})
		.then(function (tokenVal){
			var substitutions = { token: tokenVal, isDevelopment: config.isDevelopment };
			return services.MailService.send(userEmail, mail.templates.passwordReset, substitutions);
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

router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.post('', createHackerUser);
router.post('/reset', requestPasswordReset);
router.post('/accredited', middleware.permission(roles.ORGANIZERS), createAccreditedUser);
router.get('/:id', middleware.permission(roles.ORGANIZERS, isRequester), getUser);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.createHackerUser = createHackerUser;
module.exports.createAccreditedUser = createAccreditedUser;
module.exports.router = router;
