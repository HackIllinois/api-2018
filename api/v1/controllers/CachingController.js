var bodyParser = require('body-parser');

var errors = require('../errors');
var services = require('../services');
var config = require('../../config');

var middleware = require('../middleware');
var router = require('express').Router();


function saveString (req, res, next) {
	var key = req.body.key;
	var value = req.body.value;

	services.RedisCacheService.storeString(key, value)
		.then(function (status){
			res.body = {};
			res.body.status = status;
			next();
			return null;
		})
		.catch(function(error){
			next(error);
			return null;
		});
}

function saveHash (req, res, next) {
	var key = req.body.key;
	var keyVals = req.body.keyVals;

	services.RedisCacheService.storeHash(key, keyVals)
		.then(function (status){
			res.body = {};
			res.body.status = status;
			next();
			return null;
		})
		.catch(function(error){
			next(error);
			return null;
		});
}

function getString (req, res, next) {
	var key = req.query.key;

	services.RedisCacheService.getString(key)
		.then(function (string){
			res.body = {}
			res.body.value = string;
			next();
			return null;
		})
		.catch(function(error){
			next(error);
			return null;
		});
}


router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.post('/saveString', saveString);
router.post('/saveHash', saveHash);
router.get('/getString', getString);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;