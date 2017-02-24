var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();
var _Promise = require('bluebird');

var errors = require('../errors');
var config = require('../../config');
var requests = require('../requests');
var roles = require('../utils/roles');

var StatsService = require('../services/StatsService');

function getAllStats(req, res, next) {
    StatsService.fetchAllStats()
    	.then(function (stats) {
    		res.body = stats;

    		next();
    		return null;
    	})
    	.catch(function (error) {
    		next(error);
    		return null;
    	});
}

function getRegStats(req, res, next) {
	StatsService.fetchRegistrationStats()
		.then(function (stats) {
			res.body = stats;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function getRSVPStats(req, res, next) {
	StatsService.fetchRSVPStats()
		.then(function (stats) {
			res.body = stats;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function getLiveEventStats(req, res, next) {
	StatsService.fetchLiveEventStats()
		.then(function (stats) {
			res.body = stats;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/', middleware.permission(roles.ORGANIZERS), getAllStats);
router.get('/registration', middleware.permission(roles.ORGANIZERS), getRegStats);
router.get('/rsvp', middleware.permission(roles.ORGANIZERS), getRSVPStats);
router.get('/live', middleware.permission(roles.ORGANIZERS), getLiveEventStats);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
