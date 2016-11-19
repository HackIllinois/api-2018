var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();

var errors = require('../errors');
var config = require('../../config');
var roles = require('../utils/roles');

var ProjectService = require('../services/ProjectService');



function createProject (req, res, next) {
	attributes = {};
	attributes.name = req.body.name;
	attributes.description = req.body.description;
	attributes.repo = req.body.repo;
	attributes.is_published = req.body.is_published;

	ProjectService
		.canCreateProject(req.user)
		.then(function (isAuthed) {
			return ProjectService.createProject(attributes);
		})
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

function getProject (req, res, next) {
	var id = req.params.id;

	ProjectService
		.findProjectById(id)
		.then(function (project) {
			res.body = project.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}


// TODO: Make this better
function updateProject (req, res, next) {
	var id = req.params.id;
	var key = req.body.key;
	var value = req.body.value;

	ProjectService
		.findProjectById(id)
		.then(function (project) {
			return ProjectService.updateProject(project, key, value);
		})
		.then(function (project) {
			res.body = project.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function addProjectMentor (req, res, next) {
	var project_id = req.body.project_id;
	var mentor_id = req.body.mentor_id;

	ProjectService
		.addProjectMentor(project_id, mentor_id)
		.then(function (projectMentor) {
			res.body = projectMentor.toJSON();

			next();
			return null;
		})
		.catch( function (error) {
			next(error);
			return null;
		});
}

function deleteProjectMentor (req, res, next) {
	var project_id = req.body.project_id;
	var mentor_id = req.body.mentor_id;

	ProjectService
		.deleteProjectMentor(project_id, mentor_id)
		.then(function () {
			res.body = {}

			next();
			return null;
		})
		.catch( function (error) {
			next(error);
			return null;
		});
}

router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.post('/', middleware.permission(roles.ORGANIZERS), createProject);
router.get('/:id', middleware.permission(roles.ALL), getProject);
router.put('/:id', middleware.permission(roles.ORGANIZERS), updateProject);
router.post('/mentor', middleware.permission(roles.ORGANIZERS), addProjectMentor);
router.delete('/mentor', middleware.permission(roles.ORGANIZERS), deleteProjectMentor);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;