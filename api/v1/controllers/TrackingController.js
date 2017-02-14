var bodyParser = require('body-parser');

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
        .addEventParticipant(req.params.participantId)
        .then(function () {

            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.UniversalTrackingRequest),
    middleware.permission(roles.ORGANIZERS), createTrackedEvent);
router.get('/:participantId', middleware.permission(roles.HOSTS), addTrackedEventParticipant);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;