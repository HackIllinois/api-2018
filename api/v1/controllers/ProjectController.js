var _ = require('lodash');
var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();
var _Promise = require('bluebird');

var errors = require('../errors');
var config = require('../../config');
var requests = require('../requests');
var roles = require('../utils/roles');

var ProjectService = require('../services/ProjectService');
var PermissionService = require('../services/PermissionService');


function _validGetAllRequest(page, count, published){
	if(_.isNaN(page)){
		var message = "Invalid page parameter";
		var source = "page";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(count)){
		var message = "Invalid count parameter";
		var source = "count";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(published) || (published != 0 && published != 1)){
		var message = "Invalid published parameter";
		var source = "published";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	return _Promise.resolve(true);
}

function createProject (req, res, next) {
	var attributes = req.body;

	PermissionService
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

function getAllProjects (req, res, next) {
	_.defaults(req.params, {'page': 1});
	_.defaults(req.query, {'count': 10, 'published': 1});
	var page = parseInt(req.params.page);
	var count = parseInt(req.query.count);
	var published = parseInt(req.query.published);

	_validGetAllRequest(page, count, published)
		.then(function () {
			return ProjectService.getAllProjects(page, count, published);
		})
		.then(function (results) {
			res.body = {};
			res.body.projects = results;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateProject (req, res, next) {
	var id = req.params.id;
	var attributes = req.body;

	ProjectService
		.findProjectById(id)
		.then(function (project) {
			return ProjectService.updateProject(project, attributes);
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

router.post('/mentor', middleware.request(requests.ProjectMentorRequest),
	middleware.permission(roles.ORGANIZERS), addProjectMentor);
router.delete('/mentor', middleware.request(requests.ProjectMentorRequest),
	middleware.permission(roles.ORGANIZERS), deleteProjectMentor);
router.post('/', middleware.request(requests.ProjectRequest),
	middleware.permission(roles.ORGANIZERS), createProject);
router.get('/:id', middleware.permission(roles.ALL), getProject);
router.put('/:id', middleware.request(requests.ProjectRequest),
	middleware.permission(roles.ORGANIZERS), updateProject);
router.get('/all/:page', middleware.permission(roles.ALL), getAllProjects);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;

