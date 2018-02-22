const bodyParser = require('body-parser');

const services = require('../services');

const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');

const router = require('express').Router();

function createInterest(req, res, next) {
  services.RegistrationService
    .findAttendeeById(req.body.attendeeUserId, false)
    .then((attendee) => {
      services.RecruiterInterestService
        .createInterest(req.user.get('id'), attendee.get('id'), req.body.comments, req.body.favorite)
        .then((result) => {
          res.body = result.toJSON();
          return next();
        })
    })
    .catch((error) => next(error));
}

function getRecruitersInterests(req, res, next) {
  services.RecruiterInterestService
    .findByRecruiterId(req.user.get('id'))
    .then((result) => {
      res.body = result.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

function updateRecruiterInterest(req, res, next) {
  services.RecruiterInterestService
    .updateInterest(req.body.appId, req.body.comments, req.body.favorite)
    .then((result) => {
      res.body = result.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/', middleware.permission(roles.PROFESSIONALS),  getRecruitersInterests);
router.post('/apply', middleware.request(requests.RecruiterInterestRequest), middleware.permission(roles.PROFESSIONALS), createInterest);
router.put('/update', middleware.request(requests.RecruiterInterestUpdateRequest), middleware.permission(roles.PROFESSIONALS), updateRecruiterInterest);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
