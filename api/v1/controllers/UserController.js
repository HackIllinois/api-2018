const bodyParser = require('body-parser');

const services = require('../services');
const config = require('../../config');

const middleware = require('../middleware');
const requests = require('../requests');
const scopes = require('../utils/scopes');
const mail = require('../utils/mail');
const roles = require('../utils/roles');

const router = require('express').Router();

/**
 * Determines whether or not the requester is requesting its own
 * user information
 * @param  {Request}  req an Express request with auth and parameter information
 * @return {Boolean} whether or not the requester is requesting itself
 */
function isRequester(req) {
	return req.user.get('id') == req.params.id;
}

function createUser(req, res, next) {
	services.UserService
		.createUser(req.body.email, req.body.password)
		.then((user) => {
			return services.AuthService.issueForUser(user);
		})
		.then((auth) => {
			res.body = {};
			res.body.auth = auth;

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function createAccreditedUser(req, res, next) {
	services.PermissionService
		.canCreateUser(req.user, req.body.role)
		.then(() => {
			return services.UserService
				.createUser(req.body.email, req.body.password, req.body.role);
		})
		.then((user) => {
			res.body = user.toJSON();

			return next();
		})
		.catch(function(error) {
			return next(error);
		});
}

function getUser(req, res, next) {
	services.UserService
		.findUserById(req.params.id)
		.then((user) => {
			res.body = user.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function getUserByEmail(req, res, next) {
	services.UserService
		.findUserByEmail(req.params.email)
		.then((user) => {
			res.body = user.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function requestPasswordReset(req, res, next) {
	services.UserService
		.findUserByEmail(req.body.email)
		.then((user) => {
			return services.TokenService.generateToken(user, scopes.AUTH);
		})
		.then((tokenVal) => {
			const substitutions = {
				token: tokenVal,
				isDevelopment: config.isDevelopment
			};
			return services.MailService.send(req.body.email, mail.templates.passwordReset, substitutions);
		})
		.then(() => {
			res.body = {};
			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.BasicAuthRequest), createUser);
router.post('/accredited', middleware.request(requests.AccreditedUserCreationRequest),
	middleware.permission(roles.ORGANIZERS), createAccreditedUser);
router.post('/reset', middleware.request(requests.ResetTokenRequest), requestPasswordReset);
router.get('/:id(\\d+)', middleware.permission(roles.HOSTS, isRequester), getUser);
router.get('/email/:email', middleware.permission(roles.HOSTS), getUserByEmail);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.createUser = createUser;
module.exports.createAccreditedUser = createAccreditedUser;
module.exports.router = router;
