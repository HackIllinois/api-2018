var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');

var router = require('express').Router();


function _isAuthenticated (req) {
    return req.auth && (req.user !== undefined);
}

/*
function message(req, res, next) {
    res.body = {
        words: res
    };
    return next();
}
*/

function createCheckIn (req, res, next) {
    services.CheckInService
        .createCheckIn(req.user, req.body)
        .then(function(checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function(error){
            return next(error);
        });
}

function updateCheckInById (req, res, next) {
    services.UserService
        .findUserById(req.params.id)
        .then(function (user) {
            return services.CheckInService
                .findCheckInByUser(user);
        })
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

function fetchCheckInById (req, res, next) {
    services.UserService
        .findUserById(req.params.id)
        .then(function (user){
            return services.CheckInService
                .findCheckInByUser(user);
        })
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchCheckInByUser (req, res, next) {
    service.CheckInService
        .findCheckInByUser(req.user)
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

router.post('/',middleware.request(requests.CheckInRequest),
    middleware.permission(roles.NONE, _isAuthenticated), createCheckIn);
router.put('/:id', middleware.request(requests.CheckInRequest),
    middleware.permission(roles.ORGANIZERS), updateCheckInById);
router.get('/:id', middleware.permission(roles.ORGANIZERS), fetchCheckInById);
router.get('/', middleware.permission(roles.ATTENDEE), fetchCheckInByUser);

router.use(middleware.response);
router.use(middleware.errors);


module.exports.router = router;
