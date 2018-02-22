const bodyParser = require('body-parser');

const services = require('../services');

const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');

const router = require('express').Router();

function createApplication(req, res, next) {
  services.RegistrationService
    .findAttendeeById(req.body.attendeeId, false)
    .then((attendeeId) => {
      services.RecruiterInterestService
        .createApplication(req.user.get('id'), attendeeId.get('id'), req.body.comments, req.body.favorite)
        .then((application) => {
          res.body = application.toJSON();
          return next();
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
}

function getRecruitersAttendees(req, res, next) {
  services.RecruiterInterestService
    .findByRecruiterId(req.user.get('id'))
    .then((applications) => {
      res.body = applications.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

function updateApplication(req, res, next) {
  services.RecruiterInterestService
    .updateApplication(req.body.appId, req.body.comments, req.body.favorite)
    .then((application) => {
      res.body = application.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/', middleware.permission(roles.PROFESSIONALS),  getRecruitersAttendees);
router.post('/apply', middleware.request(requests.RecruiterInterestRequest), middleware.permission(roles.PROFESSIONALS), createApplication);
router.put('/update', middleware.request(requests.RecruiterInterestUpdateRequest), middleware.permission(roles.PROFESSIONALS), updateApplication);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
