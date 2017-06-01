const bodyParser = require('body-parser');
const middleware = require('../middleware');
const router = require('express').Router();

const roles = require('../utils/roles');

const PermissionService = require('../services/PermissionService');

function isOrganizer(req, res, next) {
  PermissionService.isOrganizer(req.user)
		.then((isOrganizer) => {
  res.body = {};
  res.body.allowed = isOrganizer;

  return next();
})
		.catch((error) => next(error));
}

function isHost(req, res, next) {
  PermissionService.isHost(req.user)
		.then((isHost) => {
  res.body = {};
  res.body.allowed = isHost;

  return next();
})
		.catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/host', middleware.permission(roles.ALL), isHost);
router.get('/organizer', middleware.permission(roles.ALL), isOrganizer);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
