var bodyParser = require('body-parser');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');

var router = require('express').Router();


function updateCheckInByUserId (req, res, next) {
    req.body.userId = req.params.id;
    services.CheckInService
        .updateCheckIn(req.body)
        .then(function (response){
            console.log(response.checkin.toJSON());
            res.body = response.checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchCheckInByUserId (req, res, next) {
    services.CheckInService
        .findCheckInByUserId(req.params.id)
        .then(function (fetchedCheckin){
            var body = {};
            body.checkin = fetchedCheckin.checkin.toJSON();
            if (fetchedCheckin.credentials) {
                body.credentials = fetchedCheckin.credentials.toJSON()
            }
            res.body = body;
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchCheckInByUser (req, res, next) {
    services.CheckInService
        .findCheckInByUserId(req.user.id)
        .then(function (fetchedCheckin){
            var body = {};
            body.checkin = fetchedCheckin.checkin.toJSON();
            if (fetchedCheckin.credentials) {
                body.credentials = fetchedCheckin.credentials.toJSON()
            }
            res.body = body;
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function createCheckIn (req, res, next) {
    req.body.userId = req.params.id;
    services.CheckInService
        .createCheckIn(req.body)
        .then(function (createdCheckin){
            var body = {};
            body.checkin = createdCheckin.checkin.toJSON();
            if (createdCheckin.credentials) {
                body.credentials = createdCheckin.credentials.toJSON()
            }
            res.body = body;
            return next();
        })
        .catch(function (error){
            return next(error);
        })
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/user/:id(\\d+)', middleware.request(requests.CreateCheckInRequest),
    middleware.permission(roles.ORGANIZERS), createCheckIn);
router.put('/user/:id(\\d+)', middleware.request(requests.UpdateCheckInRequest),
    middleware.permission(roles.ORGANIZERS), updateCheckInByUserId);
router.get('/user/:id(\\d+)', middleware.permission(roles.ORGANIZERS), fetchCheckInByUserId);
router.get('/', fetchCheckInByUser);

router.use(middleware.response);
router.use(middleware.errors);


module.exports.router = router;
