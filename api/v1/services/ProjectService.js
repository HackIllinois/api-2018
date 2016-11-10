var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');

var Project = require('../models/Project');
var ProjectMentor = require('../models/ProjectMentor');
var errors = require('../errors');
var utils = require('../utils');
var roles = require('../utils/roles');


module.exports.canCreateProject = function (creator) {
	if(creator.hasRole(roles.SUPERUSER) || creator.hasRole(roles.ORGANIZERS)){
		return _Promise.resolve(true);
	}

	var message = "A project cannot be created with the provided credentials";
	return _Promise.reject(new errors.UnauthorizedError(message));
}

//TODO: make the name handling better
module.exports.createProject = function (attributes) {
	if(typeof attributes.repo === 'undefined'){
		attributes.description = '';
	}
	if(typeof attributes.isPublished === 'undefined'){
		attributes.isPublished = 0; //false
	}

	attributes.name = attributes.name.toLowerCase();

	var project = Project.forge(attributes);
	return project
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return Project.findByName(attributes.name);
		})
		.then(function (result){
			if (!_.isNull(result)) {
				var message = "A project with the given name already exists";
				var source = "name";
				throw new errors.InvalidParameterError(message, source);
			}

			return project
				.save()
				.then(function (project) {
					return project;
				});
		})
}

module.exports.findProjectById = function (id) {
	return Project
		.findById(id)
		.then(function (result) {
			if(_.isNull(result)){
				var message = "A project with the given ID cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}

			return _Promise.resolve(result);
		});
}

module.exports.updateProject = function (project, key, value) {
	return project.set(key, value).save();
}


module.exports.deleteProjectMentor = function (project, mentor) {
	return ProjectMentor
		.where({ project_id: project.id, mentor_id: mentor.id }).fetch()
		.then(function(oldProjectMentor) {
			return oldProjectMentor.destroy();
		});
}


module.exports.addProjectMentor = function (project, mentor) {
	var projectMentor = ProjectMentor.forge({ project_id: project.id, mentor_id: mentor.id });

	return ProjectMentor
		.findByProjectId(project.id)
		.then(function (result) {
			if (!_.isNull(result)) {
				deleteProjectMentor(project, mentor);
			}

			return projectMentor
				.save()
				.then(function (projectMentor) {
					return projectMentor;
				});
		});
}






