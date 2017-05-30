const _ = require('lodash');
const bodyParser = require('body-parser');
const middleware = require('../middleware');
const router = require('express').Router();
const _Promise = require('bluebird');

const errors = require('../errors');
const requests = require('../requests');
const roles = require('../utils/roles');

const ProjectService = require('../services/ProjectService');
const PermissionService = require('../services/PermissionService');


function _validGetAllRequest(page, count, published) {
	if (_.isNaN(page)) {
		const message = 'Invalid page parameter';
		const source = 'page';
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if (_.isNaN(count)) {
		const message = 'Invalid count parameter';
		const source = 'count';
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if (_.isNaN(published) || (published != 0 && published != 1)) {
		const message = 'Invalid published parameter';
		const source = 'published';
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}

	return _Promise.resolve(true);
}

function createProject(req, res, next) {
	PermissionService
		.canCreateProject(req.user)
		.then(() => {
			return ProjectService.createProject(req.body);
		})
		.then((newProject) => {
			res.body = newProject.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function getProject(req, res, next) {
	ProjectService
		.findProjectById(req.params.id)
		.then((project) => {
			res.body = project.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function getAllProjects(req, res, next) {
	_.defaults(req.params, {
		'page': 1
	});
	_.defaults(req.query, {
		'count': 10,
		'published': 1
	});
	const page = parseInt(req.params.page);
	const count = parseInt(req.query.count);
	const published = parseInt(req.query.published);

	_validGetAllRequest(page, count, published)
		.then(() => {
			return ProjectService.getAllProjects(page, count, published);
		})
		.then((results) => {
			res.body = {};
			res.body.projects = results;

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function updateProject(req, res, next) {
	ProjectService
		.findProjectById(req.params.id)
		.then((project) => {
			return ProjectService.updateProject(project, req.body);
		})
		.then((project) => {
			res.body = project.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function addProjectMentor(req, res, next) {
	ProjectService
		.addProjectMentor(req.body.project_id, req.body.mentor_id)
		.then((projectMentor) => {
			res.body = projectMentor.toJSON();

			return next();
		})
		.catch((error) => {
			return next(error);
		});
}

function deleteProjectMentor(req, res, next) {
	ProjectService
		.deleteProjectMentor(req.body.project_id, req.body.mentor_id)
		.then(() => {
			res.body = {};

			return next();
		})
		.catch((error) => {
			return next(error);
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
router.get('/:id(\\d+)', middleware.permission(roles.ALL), getProject);
router.put('/:id(\\d+)', middleware.request(requests.ProjectRequest),
	middleware.permission(roles.ORGANIZERS), updateProject);
router.get('/all/:page(\\d+)', middleware.permission(roles.ALL), getAllProjects);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
