const bodyParser = require('body-parser');
const middleware = require('../middleware');
const router = require('express').Router();

const roles = require('../utils/roles');

const StatsService = require('../services').StatsService;
function getAllStats(req, res, next) {
  StatsService.fetchAllStats()
    .then((stats) => {
      res.body = stats;

      return next();
    })
    .catch((error) => next(error));
}

function getRegStats(req, res, next) {
  StatsService.fetchRegistrationStats()
    .then((stats) => {
      res.body = stats;

      return next();
    })
    .catch((error) => next(error));
}

function getRSVPStats(req, res, next) {
  StatsService.fetchRSVPStats()
    .then((stats) => {
      res.body = stats;

      return next();
    })
    .catch((error) => next(error));
}

function getLiveEventStats(req, res, next) {
  StatsService.fetchLiveEventStats()
    .then((stats) => {
      res.body = stats;

      return next();
    })
    .catch((error) => next(error));
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/all', middleware.permission(roles.ORGANIZERS), getAllStats);
router.get('/registration', middleware.permission(roles.ORGANIZERS), getRegStats);
router.get('/rsvp', middleware.permission(roles.ORGANIZERS), getRSVPStats);
router.get('/live', middleware.permission(roles.ORGANIZERS), getLiveEventStats);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
