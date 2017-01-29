var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();
var _Promise = require('bluebird');

var errors = require('../errors');
var config = require('../../config');
var requests = require('../requests');
var roles = require('../utils/roles');

var StatsService = require('../services/StatsService');

function getStats(req, res, next) {
    StatsService.fetchStats()
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

router.get('/', middleware.permission(roles.ORGANIZERS), getStats);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
