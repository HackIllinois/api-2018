var bodyParser = require('body-parser');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');
var mail = require('../utils/mail');
var User = require('../models/User');

var router = require('express').Router();

function _isAuthenticated (req) {
    return req.auth && (req.user !== undefined);
}

function _removeFromList(rsvpCurrent, rsvpNew) {
    if(rsvpCurrent.get('attendeeAttendance') !== 'NO' && rsvpNew.attendeeAttendance === 'NO')
        return true;
    return false;
}

function _addToList(rsvpCurrent, rsvpNew) {
    if(rsvpCurrent.get('attendeeAttendance') === 'NO' && rsvpNew.attendeeAttendance !== 'NO')
        return true;
    return false;
}

function createRSVP(req, res, next) {
    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function(attendee) {
            services.RSVPService
                .createRSVP(attendee, req.user, req.body)
                .then(function (rsvp) {
                    if(rsvp.get('attendeeAttendance') !== 'NO')
                        services.MailService.addToList(req.user, mail.lists.attendees);
                    res.body = rsvp.toJSON();

                    return next();
                })
        })
        .catch(function(error) {
            return next(error);
        });
}

function fetchRSVPByUser(req, res, next) {
    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function(attendee) {
            services.RSVPService
                .findRSVPByAttendee(attendee)
                .then(function(rsvp){
                    res.body = rsvp.toJSON();

                    return next();
                })
        })
        .catch(function(error) {
            return next(error);
        })
}

function fetchRSVPByAttendeeId(req, res, next) {
    services.RegistrationService
        .findAttendeeById(req.params.id)
        .then(function(attendee) {
            services.RSVPService
                .findRSVPByAttendee(attendee)
                .then(function(rsvp){
                    res.body = rsvp.toJSON();

                    return next();
                })
        })
        .catch(function(error) {
            return next(error);
        })
}

function updateRSVPByUser(req, res, next) {
    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function(attendee) {
            services.RSVPService
                .findRSVPByAttendee(attendee)
                .then(function (rsvp) {
                    if(_addToList(rsvp, req.body))
                        services.MailService.addToList(req.user, mail.lists.attendees);
                    if(_removeFromList(rsvp, req.body))
                        services.MailService.removeFromList(req.user, mail.lists.attendees);

                    return services.RSVPService.updateRSVP(rsvp, req.body);
                })
                .then(function(rsvp){
                    res.body = rsvp.toJSON();

                    return next();
                })
        })
        .catch(function (error) {
            return next(error);
        });
}

function updateRSVPById(req, res, next) {
    services.RegistrationService
        .findAttendeeById(req.params.id)
        .then(function(attendee) {
            services.RSVPService
                .findRSVPByAttendee(attendee)
                .then(function (rsvp) {
                    if(_addToList(rsvp, req.body))
                        services.MailService.addToList(req.user, mail.lists.attendees);
                    if(_removeFromList(rsvp, req.body))
                        services.MailService.removeFromList(req.user, mail.lists.attendees);

                    return services.RSVPService.updateRSVP(rsvp, req.body);
                })
                .then(function(rsvp){
                    res.body = rsvp.toJSON();

                    return next();
                })
        })
        .catch(function (error) {
            return next(error);
        });
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.RSVPRequest),
    middleware.permission(roles.NONE, _isAuthenticated), createRSVP);
router.get('/', middleware.permission(roles.ATTENDEE), fetchRSVPByUser);
router.get('/:id', middleware.permission(roles.ORGANIZERS), fetchRSVPByAttendeeId);
router.put('/', middleware.request(requests.RSVPRequest),
    middleware.permission(roles.ATTENDEE), updateRSVPByUser);
router.put('/:id', middleware.request(requests.RSVPRequest),
    middleware.permission(roles.ORGANIZERS), updateRSVPById);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;