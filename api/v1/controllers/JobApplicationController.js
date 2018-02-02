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
  console.log("create applicants");
  services.JobApplicationService
    .createApplication(req.user.get('id'), req.body.applicantId, req.body.comments, req.body.favorite)
    .then((application) => {
      res.body = application.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

function getRecruitersApplicants(req, res, next) {
  console.log("get applicants");
  services.JobApplicationService
    .findByRecruiterId(req.params.id)
    .then((applications) => {
      res.body = applications.toJSON();
      return next();
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);
//middleware.permission(roles.ADMIN, isRecruiter)
router.get('/:id(\\d+)',  getRecruitersApplicants);
router.post('/apply', middleware.request(requests.JobApplicationRequest), createApplication);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
