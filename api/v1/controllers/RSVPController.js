const bodyParser = require('body-parser');

const services = require('../services');
const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');
const config = require('../../config');

const router = require('express').Router();
function _isAuthenticated(req) {
  return req.auth && (req.user !== undefined);
}

function _removeFromList(rsvpCurrent, rsvpNew) {
  return rsvpCurrent.get('isAttending') && !rsvpNew.isAttending;
}

function _addToList(rsvpCurrent, rsvpNew) {
  return !rsvpCurrent.get('isAttending') && rsvpNew.isAttending;
}

function createRSVP(req, res, next) {
  if (!req.body.isAttending) {
    delete req.body.type;
  }

  services.RegistrationService
    .findAttendeeByUser(req.user)
    .then((attendee) => services.RSVPService
      .createRSVP(attendee, req.user, req.body))
    .then((rsvp) => {
      if (rsvp.get('isAttending')) {
        services.MailService.addToList(req.user, config.mail.lists.attendees);
      }
      res.body = rsvp.toJSON();

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
      if (!res.body.type) {
        delete res.body.type;
      }

      return next();
    })
    .catch((error) => next(error));
}

function fetchRSVPById(req, res, next) {
  services.RSVPService
    .getRSVPById(req.params.id)
    .then((rsvp) => {
      res.body = rsvp.toJSON();
      if (!res.body.type) {
        delete res.body.type;
      }

      return next();
    })
    .catch((error) => next(error));
}

function updateRSVPByUser(req, res, next) {
  if (!req.body.isAttending) {
    delete req.body.type;
  }

  services.RegistrationService
    .findAttendeeByUser(req.user)
    .then((attendee) => _updateRSVPByAttendee(req.user, attendee, req.body))
    .then((rsvp) => {
      res.body = rsvp.toJSON();

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
  middleware.permission(roles.ATTENDEE, _isAuthenticated), createRSVP);
router.get('/attendee/', middleware.permission(roles.ATTENDEE), fetchRSVPByUser);
router.get('/attendee/:id(\\d+)', middleware.permission(roles.ORGANIZERS), fetchRSVPById);
router.put('/attendee/', middleware.request(requests.RSVPRequest),
  middleware.permission(roles.ATTENDEE), updateRSVPByUser);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
