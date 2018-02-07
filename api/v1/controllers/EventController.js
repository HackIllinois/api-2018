const bodyParser = require('body-parser');
const _ = require('lodash');

const services = require('../services');
const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');

const router = require('express').Router();

function createLocation(req, res, next) {
  services.EventService.createLocation(req.body)
    .then((result) => {
      res.body = result.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function getAllLocations(req, res, next) {
  services.EventService.getAllLocations()
    .then((results) => {
      res.body = results.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function createEvent(req, res, next) {
  services.EventService.createEvent(req.body)
    .then((result) => {
      result.event = result.event.toJSON();
      if (!_.isNil(result.eventLocations)) {
        _.map(result.eventLocations, (location) => location.toJSON());
      }

      res.body = result;

      return next();
    })
    .catch((error) => next(error));
}

function getEvents(req, res, next) {
  const activeOnly = (req.query.active == '1');
  services.EventService.getEvents(activeOnly)
    .then((result) => {
      res.body = result.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.EventCreationRequest), middleware.permission(roles.ORGANIZERS), createEvent);
router.get('/', getEvents);
router.get('/location/all', getAllLocations);
router.post('/location', middleware.request(requests.LocationCreationRequest), middleware.permission(roles.ORGANIZERS), createLocation);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
