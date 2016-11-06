var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');

var Project = require('../models/Project');
var ProjectMentor = require('../models/ProjectMentor');
var errors = require('../errors');
var utils = require('../utils');


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
