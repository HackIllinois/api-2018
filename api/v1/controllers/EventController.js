var bodyParser = require('body-parser');
var _ = require('lodash');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');

var router = require('express')
  .Router();


function createLocation(req, res, next) {
    services.EventService.createLocation(req.body)
    .then(function(result) {
        res.body = result.toJSON();

        next();
        return null;
    })
    .catch(function(error) {
        next(error);
        return null;
    });
}

function getAllLocations(req, res, next) {
    services.EventService.getAllLocations()
    .then(function(results) {
        res.body = results.toJSON();

        next();
        return null;
    })
    .catch(function(error) {
        next(error);
        return null;
    });
}

function createEvent(req, res, next) {
    services.EventService.createEvent(req.body)
    .then(function(result) {
        result.event = result.event.toJSON();
        if (!_.isNil(result.eventLocations)) {
            _.map(result.eventLocations, (location) => {
                return location.toJSON();
            });
        }

        res.body = result;

        next();
        return null;
    })
    .catch(function(error) {
        next(error);
        return null;
    });
}

function getEvents(req, res, next) {
    var activeOnly = (req.query.active == '1');
    services.EventService.getEvents(activeOnly)
    .then(function(result) {
        res.body = result.toJSON();

        next();
        return null;
    })
    .catch(function(error) {
        next(error);
        return null;
    });
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.EventCreationRequest), middleware.permission(roles.ORGANIZERS), createEvent);
router.get('/', getEvents);
router.get('/location/all', middleware.permission(roles.ORGANIZERS), getAllLocations);
router.post('/location', middleware.request(requests.LocationCreationRequest), middleware.permission(roles.ORGANIZERS), createLocation);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
