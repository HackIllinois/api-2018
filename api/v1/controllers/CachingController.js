var bodyParser = require('body-parser');

var errors = require('../errors');
var services = require('../services');
var config = require('../../config');

var middleware = require('../middleware');
var router = require('express').Router();

function saveString (req, res, next) {
	var key = req.body.key;
	var params = req.body.value;

	services.RedisCacheService.storeString(key, params)
		.then(function (status){
			res.body = {};
			res.body.status = status;
			next();
			return null;
		});	
}


router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.post('/saveString', saveString);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;