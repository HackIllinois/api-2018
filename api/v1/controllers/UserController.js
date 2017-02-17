var bodyParser = require('body-parser');

var errors = require('../errors');
var services = require('../services');
var config = require('../../config');

var middleware = require('../middleware');
var requests = require('../requests');
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
	return req.user.get('id') == req.params.id;
}

function createUser (req, res, next) {
	services.UserService
		.createUser(req.body.email, req.body.password)
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
	services.PermissionService
		.canCreateUser(req.user, req.body.role)
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

function getUserByEmail (req, res, next) {
	var email = req.params.email;

	services.UserService
		.findUserByEmail(email)
		.then(function(user) {
			res.body = user.toJSON();

			return next();
		})
		.catch(function (error) {
			return next(error);
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

router.post('/', middleware.request(requests.BasicAuthRequest), createUser);
router.post('/accredited', middleware.request(requests.AccreditedUserCreationRequest),
	middleware.permission(roles.ORGANIZERS), createAccreditedUser);
router.post('/reset', middleware.request(requests.ResetTokenRequest), requestPasswordReset);
router.get('/:id', middleware.permission(roles.ORGANIZERS, isRequester), getUser);
router.get('/email/:email', middleware.permission(roles.ORGANIZERS), getUserByEmail);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.createUser = createUser;
module.exports.createAccreditedUser = createAccreditedUser;
module.exports.router = router;
