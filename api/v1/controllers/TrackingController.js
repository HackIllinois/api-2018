var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');

var router = require('express').Router();

function createTrackedEvent(req, res, next) {
    services.TrackingService
        .createTrackingEvent(req.body)
        .then(function (result) {
            res.body = result.toJSON();

            return next();
        })
        .catch(function (error) {
            return next(error);
        });
}

function addTrackedEventParticipant(req, res, next) {
    services.TrackingService
        .addEventParticipant(req.params.eventName, req.params.participantId)
        .then(function (results) {
            res.body = results.toJSON();

            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function getActiveEvents(req, res, next) {
    services.TrackingService
        .getActiveEvents()
        .then(function (results) {
            res.body = results.toJSON();

            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

router.use(bodyParser.json());

router.post('/', middleware.auth, middleware.request(requests.UniversalTrackingRequest),
    middleware.permission(roles.ORGANIZERS), createTrackedEvent());
router.get('/', middleware.auth, middleware.permission(roles.ORGANIZERS), getActiveEvents());
router.get('/attendee/:eventName/:participantId', addTrackedEventParticipant);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;