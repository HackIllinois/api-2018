var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();

var errors = require('../errors');
var config = require('../../config');

var ProjectService = require('../services/ProjectService');

//TODO: Add project creation validation

function createProject (req, res, next) {
	attributes = {};
	attributes.name = req.body.name;
	attributes.description = req.body.description;
	attributes.repo = req.body.repo;
	attributes.isPublished = req.body.isPublished;

	ProjectService
		.createProject(attributes)
		.then(function (newProject) {
			res.body = newProject.toJSON();

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
router.use(middleware.request);

router.post('/', createProject);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;