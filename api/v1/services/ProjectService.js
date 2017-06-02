const Checkit = require('checkit');
const _Promise = require('bluebird');
const _ = require('lodash');

const Mentor = require('../models/Mentor');
const Project = require('../models/Project');
const ProjectMentor = require('../models/ProjectMentor');

const errors = require('../errors');
const utils = require('../utils');


/**
 * Creates a project with the specificed attributes
 * @param  {Object} Contains name, description, repo, and isPublished
 * @return {Promise} resolving to the newly-created project
 * @throws InvalidParameterError when a project exists with the specified name
 */
module.exports.createProject = (attributes) => {
  if (_.isNull(attributes.isPublished) || _.isUndefined(attributes.isPublished)) {
    attributes.isPublished = false;
  }

  const project = Project.forge(attributes);
  return project
    .validate()
    .catch(Checkit.Error, utils.errors.handleValidationError)
    .then(() => project.save())
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('A project with the given name already exists', 'name')
    );
};

/**
 * Returns a project with the specified project id
 * @param  {int} ID of the project
 * @return {Promise} resolving to the project
 * @throws InvalidParameterError when a project doesn't exist with the specified ID
 */
module.exports.findProjectById = (id) => Project
    .findById(id)
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'A project with the given ID cannot be found';
        const source = 'id';
        throw new errors.NotFoundError(message, source);
      }

      return _Promise.resolve(result);
    });

/**
 * Update a key value pair in a project
 * @param  {Project} Project that will be updated
 * @param  {Object} JSON representing new project mentor key value pairs
 * @return {Promise} resolving to the updated project
 * @throws InvalidParameterError when the key is not valid
 */
module.exports.updateProject = (project, attributes) => {
  project.set(attributes);

  return project
    .validate()
    .catch(Checkit.Error, utils.errors.handleValidationError)
    .then(() => project.save());
};

/**
 * Helper function for determining valid project/mentor ids
 * @param  {Int} ID of the project assigned to the mentor
 * @param  {Int} ID of the mentor assigned to the project
 * @return {Promise} resolving to whether or not the ids are valid
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
function _isProjectMentorValid(project_id, mentor_id) {
  return Project
    .findById(project_id)
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'The project id is invalid';
        const source = 'project_id';
        throw new errors.InvalidParameterError(message, source);
      }
      return Mentor.findById(mentor_id);
    })
    .then((mentor) => {
      if (_.isNull(mentor)) {
        const message = 'The mentor id is invalid';
        const source = 'mentor_id';
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
function _deleteProjectMentor(project_id, mentor_id) {
  return ProjectMentor
    .findByProjectAndMentorId(project_id, mentor_id)
    .then((oldProjectMentor) => {
      if (_.isNull(oldProjectMentor)) {
        const message = 'A project-mentor relationship with the given IDs cannot be found';
        const source = 'project_id/mentor_id';
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
module.exports.addProjectMentor = (project_id, mentor_id) => {
  const projectMentor = ProjectMentor.forge({
    project_id: project_id,
    mentor_id: mentor_id
  });

  return _isProjectMentorValid(project_id, mentor_id)
    .then(() => ProjectMentor.findByProjectAndMentorId(project_id, mentor_id))
    .then((result) => {
      if (!_.isNull(result)) {
        //The project mentor relationship already exists
        return _Promise.resolve(result);
      }
      return projectMentor.save();
    });
};

/**
 * Deletes a project-mentor relationship
 * @param  {Int} ID of the project in question
 * @param  {Int} ID of the mentor in question
 * @return {Promise} resolving to the deleted relationship
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
module.exports.deleteProjectMentor = (project_id, mentor_id) => _deleteProjectMentor(project_id, mentor_id);


/**
 * Returns a list of all projects
 * @param  {Int} Page number
 * @param  {Int} Number of items on the page
 * @param  {Int} Boolean in int form representing published/unpublished
 * @return {Promise} resolving to an array of project objects
 */
module.exports.getAllProjects = (page, count, isPublished) => Project
    .query((qb) => {
      qb.groupBy('projects.id');
      qb.where('is_published', '=', isPublished);
    })
    .orderBy('-name')
    .fetchPage({
      pageSize: count,
      page: page
    })
    .then((results) => {
      const projects = _.map(results.models, 'attributes');
      return projects;
    });
