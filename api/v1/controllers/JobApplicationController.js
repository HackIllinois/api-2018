const bodyParser = require('body-parser');

const services = require('../services');

const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');

const router = require('express').Router();

function isRecruiter(req) {
  return req.user.get('id') == req.params.id && req.user.hasRole(roles.PROFESSIONALS);
}

function createApplication(req, res, next) {
  services.JobApplicationService
    .createApplication(req.user.get('id'), req.body.applicantId, req.body.comments, req.body.favorite)
    .then((application) => {
      res.body = application.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

function getRecruitersApplicants(req, res, next) {
  services.JobApplicationService
    .findByRecruiterId(req.params.id)
    .then((applications) => {
      res.body = applications.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

function updateApplication(req, res, next) {
  services.JobApplicationService
    .updateApplication(req.body.appId, req.body.comments, req.body.favorite)
    .then((application) => {
      res.body = application.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/:id(\\d+)', middleware.permission(roles.ADMIN, isRecruiter),  getRecruitersApplicants);
router.post('/apply', middleware.request(requests.JobApplicationRequest), middleware.permission(roles.ADMIN, isRecruiter), createApplication);
router.post('/update', middleware.request(requests.JobApplicationUpdateRequest), middleware.permission(roles.ADMIN, isRecruiter), updateApplication);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
