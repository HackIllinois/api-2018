var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');

var Mentor = require('../models/Mentor');
var Project = require('../models/Project');
var ProjectMentor = require('../models/ProjectMentor');

var errors = require('../errors');
var utils = require('../utils');
var roles = require('../utils/roles');

const projectKeys = ["name", "description", "repo", "isPublished"];


/**
 * Creates a project with the specificed attributes
 * @param  {Object} Contains name, description, repo, and is_published
 * @return {Promise} resolving to the newly-created project
 * @throws InvalidParameterError when a project exists with the specified name
 */
module.exports.createProject = function (attributes) {
	if(_.isNull(attributes.isPublished) || _.isUndefined(attributes.isPublished)){
		attributes.isPublished = false;
	}

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

/**
 * Returns a project with the specified project id
 * @param  {int} ID of the project
 * @return {Promise} resolving to the project
 * @throws InvalidParameterError when a project doesn't exist with the specified ID
 */
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

/**
 * Update a key value pair in a project
 * @param  {Project} Project that will be updated
 * @param  {String} Key is the name of the attribute
 * @param  {String} Value is the new value of the attribute
 * @return {Promise} resolving to the updated project
 * @throws InvalidParameterError when the key is not valid
 */
module.exports.updateProject = function (project, key, value) {
	if(projectKeys.indexOf(key.toLowerCase()) == -1){
		var message = "The given key is invalid";
		var source = "key";
		throw new errors.InvalidParameterError(message, source);
	}
	return project
		.set(key, value)
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return project.save();
		});
}

/**
 * Helper function for determining valid project/mentor ids
 * @param  {Int} ID of the project assigned to the mentor
 * @param  {Int} ID of the mentor assigned to the project
 * @return {Promise} resolving to whether or not the ids are valid
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
_isProjectMentorValid = function (project_id, mentor_id) {
	return Project
		.findById(project_id)
		.then(function (result) {
			if(_.isNull(result)) {
				var message = "The project id is invalid";
				var source = "project_id";
				throw new errors.InvalidParameterError(message, source);
			}
			return Mentor.findById(mentor_id);
		})
		.then(function (mentor) {
			if(_.isNull(mentor)) {
				var message = "The mentor id is invalid";
				var source = "mentor_id";
				throw new errors.InvalidParameterError(message, source);
			}
			return _Promise.resolve(false);
		});
}

/**
 * Helper function for deleting project-mentor relationships
 * @param  {Int} ID of the project assigned to the mentor
 * @param  {Int} ID of the mentor assigned to the project
 * @return {Promise} resolving to null
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
_deleteProjectMentor = function (project_id, mentor_id) {
	return ProjectMentor
		.findByProjectAndMentorId(project_id, mentor_id)
		.then(function(oldProjectMentor) {
			if(_.isNull(oldProjectMentor)) {
				var message = "A project-mentor relationship with the given IDs cannot be found";
				var source = "project_id/mentor_id";
				throw new errors.NotFoundError(message, source);
			}
			return oldProjectMentor.destroy();
		});
}


/**
 * Add a new project-mentor relationship
 * @param  {Int} ID of the project assigned to the mentor
 * @param  {Int} ID of the mentor assigned to the project
 * @return {Promise} resolving to the new relationship
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
module.exports.addProjectMentor = function (project_id, mentor_id) {
	var projectMentor = ProjectMentor.forge({ project_id: project_id, mentor_id: mentor_id });

	return _isProjectMentorValid(project_id, mentor_id)
		.then(function (isValid) {
			return ProjectMentor.findByProjectAndMentorId(project_id, mentor_id);
		})
		.then(function (result) {
			if (!_.isNull(result)) {
				//The project mentor relationship already exists
				return _Promise.resolve(result);
			}

			return projectMentor
				.save()
				.then(function (projectMentor) {
					return projectMentor;
				});
		})
}

/**
 * Deletes a project-mentor relationship
 * @param  {Int} ID of the project in question
 * @param  {Int} ID of the mentor in question
 * @return {Promise} resolving to the deleted relationship
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
module.exports.deleteProjectMentor = function (project_id, mentor_id) {
	return _deleteProjectMentor(project_id, mentor_id);
}

