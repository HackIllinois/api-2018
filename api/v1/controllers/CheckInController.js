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

function createAttendeeCheckIn (req, res, next) {
    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function (attendee) {
            return services.CheckInService
                .createCheckIn(attendee, req.user, req.body)
                .then(function(){
                    return next();
                });
        })
        .catch(function (error) {
            return next(error);
        });
}

function updateAttendeeCheckInById (req, res, next) {
    services.RegistrationService
        .findAttendeeById(req.params.id)
        .then(function (attendee) {
            return services.CheckInService
                .findCheckInByAttendee(attendee);
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

function fetchAttendeeCheckInById (req, res, next) {
    services.RegistrationService
        .findAttendeeById(req.params.id)
        .then(function (attendee){
            return services.CheckInService
                .findCheckInByAttendee(attendee);
        })
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchAttendeeCheckInByUser (req, res, next) {
    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function(attendee) {
            return services.CheckIn
                .findCheckInByAttendee(attendee);
        })
        .then(function(checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function(error) {
            return next(error);
        });
}

function createMentorCheckIn (req, res, next) {
    services.RegistrationService
        .findMentorByUser(req.user)
        .then(function (mentor) {
            return services.CheckInService
                .createCheckIn(mentor, req.user, req.body)
                .then(function(){
                    return next();
                });
        })
        .catch(function (error) {
            return next(error);
        });
}

function updateMentorCheckInById (req, res, next) {
    services.RegistrationService
        .findMentorById(req.params.id)
        .then(function (mentor) {
            return services.CheckInService
                .findCheckInByMentor(mentor);
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

function fetchMentorCheckInById (req, res, next) {
    services.RegistrationService
        .findMentorById(req.params.id)
        .then(function (mentor){
            return services.CheckInService
                .findCheckInByMentor(mentor);
        })
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchMentorCheckInByUser (req, res, next) {
    services.RegistrationService
        .findMentorByUser(req.user)
        .then(function(mentor) {
            return services.CheckIn
                .findCheckInByMentor(mentor);
        })
        .then(function(checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function(error) {
            return next(error);
        });
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/attendee/',middleware.request(requests.CheckInRequest),
    middleware.permission(roles.NONE, _isAuthenticated), createAttendeeCheckIn);
router.put('/attendee/:id', middleware.request(requests.CheckInRequest),
    middleware.permission(roles.ORGANIZERS), updateAttendeeCheckInById);
router.get('/attendee/:id', middleware.permission(roles.ORGANIZERS), fetchAttendeeCheckInById);
router.get('/attendee/', middleware.permission(roles.ATTENDEE),
    fetchAttendeeCheckInByUser);

router.post('/mentor/',middleware.request(requests.CheckInRequest),
    middleware.permission(roles.NONE, _isAuthenticated), createMentorCheckIn);
router.put('/mentor/:id', middleware.request(requests.CheckInRequest),
    middleware.permission(roles.ORGANIZERS), updateMentorCheckInById);
router.get('/mentor/:id', middleware.permission(roles.ORGANIZERS), fetchMentorCheckInById);
router.get('/mentor/', middleware.permission(roles.PROFESSIONALS),
    fetchMentorCheckInByUser);

router.use(middleware.response);
router.use(middleware.errors);


module.exports.router = router;
