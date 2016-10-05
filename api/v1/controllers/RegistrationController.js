var bodyParser = require('body-parser');

var errors = require('../errors');
var services = require('../services');
var config = require('../../config');
var middleware = require('../middleware');

var roles = require('../utils/roles');

var router = require('express').Router();

router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

function createMentor(req, res, next) {
  services.RegistrationService.createMentor(req.body['mentor'], req.user)
  .then(function (mentor) {
    res.body = mentor.toJSON();
    
		next();
		return null;
  })
  .catch(function (error) {
    next(error);
    return null;
  });
}

router.post('/mentor', createMentor);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.createAttendee = createAttendee;
module.exports.createAccreditedUser = createAccreditedUser;
module.exports.router = router;
