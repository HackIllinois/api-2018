var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();
var _Promise = require('bluebird');

var errors = require('../errors');
var config = require('../../config');
var requests = require('../requests');
var roles = require('../utils/roles');

var PermissionService = require('../services/PermissionService');


function isOrganizer(req, res, next) {
	var user = req.user;
	PermissionService.isOrganizer(user)
		.then(function (isOrganizer) {
			res.body = {};
			res.body.allowed = isOrganizer;

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

router.get('/organizer', middleware.permission(roles.ALL), isOrganizer);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
