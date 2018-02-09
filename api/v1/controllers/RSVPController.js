const bodyParser = require('body-parser');

const services = require('../services');
const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');
const config = require('ctx').config();

const router = require('express').Router();
function _isValidUser(req) {
  if(!req.auth || req.user == undefined) {
    return false;
  }
  return services.RegistrationService.findAttendeeByUser(req.user).then((attendee) => attendee != null && attendee.get('status') == 'ACCEPTED');
}

function _removeFromList(rsvpCurrent, rsvpNew) {
  return rsvpCurrent.get('isAttending') && !rsvpNew.isAttending;
}

function _addToList(rsvpCurrent, rsvpNew) {
  return !rsvpCurrent.get('isAttending') && rsvpNew.isAttending;
}

function createRSVP(req, res, next) {

  let attendeeModel;
  services.RegistrationService
    .findAttendeeByUser(req.user)
    .then((attendee) => {
      attendeeModel = attendee;
      return services.RSVPService.createRSVP(attendee, req.user, req.body);
    })
    .then((rsvp) => {
      if (rsvp.get('isAttending')) {
        services.MailService.addToList(req.user, config.mail.lists.attendees);
      }
      res.body = rsvp.toJSON();

      const substitutions = {
        name: attendeeModel.get('firstName'),
        isDevelopment: config.isDevelopment
      };
      services.MailService.send(req.user.get('email'), config.mail.templates.rsvpConfirmation, substitutions);

      return next();
    })
    .catch((error) => next(error));
}

function fetchRSVPByUser(req, res, next) {
  services.RegistrationService
    .findAttendeeByUser(req.user)
    .then((attendee) => services.RSVPService
      .findRSVPByAttendee(attendee))
    .then((rsvp) => {
      res.body = rsvp.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function fetchRSVPById(req, res, next) {
  services.RSVPService
    .getRSVPById(req.params.id)
    .then((rsvp) => {
      res.body = rsvp.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function updateRSVPByUser(req, res, next) {

  let attendeeModel;
  services.RegistrationService
    .findAttendeeByUser(req.user)
    .then((attendee) => {
      attendeeModel = attendee;
      return _updateRSVPByAttendee(req.user, attendee, req.body);
    })
    .then((rsvp) => {
      res.body = rsvp.toJSON();

      const substitutions = {
        name: attendeeModel.get('firstName'),
        isDevelopment: config.isDevelopment
      };
      services.MailService.send(req.user.get('email'), config.mail.templates.rsvpUpdate, substitutions);

      return next();
    })
    .catch((error) => next(error));
}

function _updateRSVPByAttendee(user, attendee, newRSVP) {
  return services.RSVPService
    .findRSVPByAttendee(attendee)
    .then((rsvp) => services.RSVPService.updateRSVP(user, rsvp, newRSVP)
      .then((updatedRSVP) => {
        if (_addToList(rsvp, newRSVP)) {
          services.MailService.addToList(user, config.mail.lists.attendees);
        }
        if (_removeFromList(rsvp, newRSVP)) {
          services.MailService.removeFromList(user, config.mail.lists.attendees);
        }

        return updatedRSVP;
      }));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/attendee', middleware.request(requests.RSVPRequest),
  middleware.permission(roles.ATTENDEE, _isValidUser), createRSVP);
router.get('/attendee/', middleware.permission(roles.ATTENDEE, _isValidUser), fetchRSVPByUser);
router.get('/attendee/:id(\\d+)', middleware.permission(roles.ORGANIZERS), fetchRSVPById);
router.put('/attendee/', middleware.request(requests.RSVPRequest),
  middleware.permission(roles.ATTENDEE, _isValidUser), updateRSVPByUser);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
