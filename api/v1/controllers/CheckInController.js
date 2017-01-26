var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');

var router = require('express').Router();


function updateCheckInByUserId (req, res, next) {
    services.CheckInService
        .findByUserId(req.params.id)
        .then(function (checkin){
            return services.CheckInService.updateCheckIn(checkin, req.body);
        })
        .then(function (response){
            res.body = response.toJSON();
            return next();
        })
        .catch(function (error){
           return next(error);
        });
}

function fetchCheckInByUserId (req, res, next) {
    services.CheckInService
        .findByUserId(req.params.id)
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchCheckInByUser (req, res, next) {
    services.CheckInService
        .findByUserId(req.user.id)
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error)
        });
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.put('/:id', middleware.request(requests.CheckInRequest),
    middleware.permission(roles.ORGANIZERS), updateCheckInByUserId);
router.get('/:id', middleware.permission(roles.ORGANIZERS), fetchCheckInByUserId);
router.get('/', middleware.permission(roles.ATTENDEE), fetchCheckInByUser);

router.use(middleware.response);
router.use(middleware.errors);


module.exports.router = router;
