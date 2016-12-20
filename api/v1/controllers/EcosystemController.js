var _ = require('lodash');
var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();
var _Promise = require('bluebird');

var errors = require('../errors');
var config = require('../../config');
var requests = require('../requests');
var roles = require('../utils/roles');

var Ecosystem = require('../models/Ecosystem');


function createEcosystem (req, res, next) {
	var name = req.body.name;
	var ecosystem = Ecosystem.forge({name: name.toLowerCase()});

	Ecosystem.findByName(name)
		.then(function (result) {
			if (!_.isNull(result)) {
				var message = "An ecosystem with the given name already exists";
				var source = "name";
				throw new errors.InvalidParameterError(message, source);
			}

			return ecosystem.save();
		})
		.then(function (newEcosystem) {
			res.body = {};
			res.body.ecosystem = newEcosystem.attributes.name;

			next();
			return null;
		})
		.catch(function (error){
			next(error);
			return null;
		});
}

function getAllEcosystems (req, res, next) {
	Ecosystem.fetchAll()
		.then(function (results) {
			res.body = results.toJSON();

			next();
			return null;
		})
		.catch(function (error){
			next(error);
			return null;
		});
}

function deleteEcosystem (req, res, next) {
	var name = req.body.name;

	Ecosystem.findByName(name)
		.then(function (result) {
			if (_.isNull(result)) {
				var message = "An ecosystem with the given name does not exist";
				var source = "name";
				throw new errors.InvalidParameterError(message, source);
			}

			return result.destroy();
		})
		.then(function () {
			res.body = {}

			next();
			return null;
		})
		.catch(function (error){
			next(error);
			return null;
		});
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.get('/all', middleware.permission(roles.ORGANIZERS), getAllEcosystems);
router.post('/', middleware.permission(roles.ORGANIZERS), createEcosystem);
router.delete('/', middleware.permission(roles.ORGANIZERS), deleteEcosystem);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;