var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');

var router = require('express').Router();


function createLocation (req, res, next) {
    services.EventService.createLocation(req.body)
        .then(function (result) {
            res.body = result.toJSON();

            next();
            return null;
        })
        .catch(function (error){
            next(error);
            return null;
        });
}

function getAllLocations (req, res, next) {
    services.EventService.getAllLocations()
        .then(function (results) {
            res.body = results.toJSON();

            next();
            return null;
        })
        .catch(function (error){
            next(error);
            return null;
        });
}

function createEvent (req, res, next) {
    services.EventService.createEvent(req.body)
        .then(function (result) {
            res.body = result.toJSON();

            next();
            return null;
        })
        .catch(function (error) {
            next(error);
            return null;
        });
}

function getAllEvents (req, res, next) {
    services.EventService.getAllEvents()
        .then(function (result) {
            res.body = result.toJSON();

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

router.post('/', middleware.request(requests.EventCreationRequest), middleware.permission(roles.ORGANIZERS), createEvent);
router.get('/', middleware.permission(roles.ORGANIZERS), getAllEvents);
router.get('/location', middleware.permission(roles.ORGANIZERS), getAllLocations);
router.post('/location', middleware.request(requests.LocationCreationRequest), middleware.permission(roles.ORGANIZERS), createLocation);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;