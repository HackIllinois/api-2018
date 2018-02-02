const bodyParser = require('body-parser');

const services = require('../services');
const config = require('../../config');

const middleware = require('../middleware');
const requests = require('../requests');
const scopes = require('../utils/scopes');
const roles = require('../utils/roles');

const router = require('express').Router();

function isRecruiter(req) {
  return req.user.get('id') == req.params.id && req.user.hasRoles(roles.RECRUITER);
}

function getApplicants(req, res, next) {
  services.RecruiterService(req.body.id)
    .then((recruiter) => {
        console.log(recruiter.toJSON());
    })
}

function addApplicants(req, res, next) {
  
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/:id(\\d+)/applicants', middleware.permission(roles.ADMIN, isRequester), getApplicants);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
