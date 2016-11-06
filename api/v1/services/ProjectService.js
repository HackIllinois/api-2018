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

module.exports.createProject = function (attributes) {
	if(typeof attributes.repo === 'undefined'){
		attributes.description = '';
	}
	if(typeof attributes.isPublished === 'undefined'){
		attributes.isPublished = 0; //false
	}

	var project = Project.forge(attributes);
	return project
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return project
				.save()
				.then(function (project) {
					return project;
				});
		});
}
