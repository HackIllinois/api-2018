const bodyParser = require('body-parser');
const _ = require('lodash');

const services = require('../services');
const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');

const router = require('express').Router();

function updateCheckInByUserId(req, res, next) {
  req.body.userId = req.params.id;
  delete req.body.credentialsRequested;

  services.CheckInService
		.updateCheckIn(req.body)
		.then((response) => {
  response.checkin = response.checkin.toJSON();
  if (!_.isNil(response.credentials)) {
    response.credentials = response.credentials.toJSON();
  }
  res.body = response;
  return next();
})
		.catch((error) => next(error));
}

function fetchCheckInByUserId(req, res, next) {
  services.CheckInService
		.findCheckInByUserId(req.params.id)
		.then((response) => {
  response.checkin = response.checkin.toJSON();
  if (!_.isNil(response.credentials)) {
    response.credentials = response.credentials.toJSON();
  }
  res.body = response;
  return next();
})
		.catch((error) => next(error));
}

function fetchCheckInByUser(req, res, next) {
  services.CheckInService
		.findCheckInByUserId(req.user.id)
		.then((response) => {
  response.checkin = response.checkin.toJSON();
  if (!_.isNil(response.credentials)) {
    response.credentials = response.credentials.toJSON();
  }
  res.body = response;
  return next();
})
		.catch((error) => next(error));
}

function createCheckIn(req, res, next) {
  req.body.userId = req.params.id;
  services.CheckInService
		.createCheckIn(req.body)
		.then((response) => {
  response.checkin = response.checkin.toJSON();
  if (!_.isNil(response.credentials)) {
    response.credentials = response.credentials.toJSON();
  }
  res.body = response;
  return next();
})
		.catch((error) => next(error));
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/user/:id(\\d+)', middleware.request(requests.CheckInRequest),
	middleware.permission(roles.HOSTS), createCheckIn);
router.put('/user/:id(\\d+)', middleware.request(requests.CheckInRequest),
	middleware.permission(roles.HOSTS), updateCheckInByUserId);
router.get('/user/:id(\\d+)', middleware.permission(roles.HOSTS), fetchCheckInByUserId);
router.get('/', fetchCheckInByUser);

router.use(middleware.response);
router.use(middleware.errors);


module.exports.router = router;
