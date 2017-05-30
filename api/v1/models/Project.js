const Model = require('./Model');

const Project = Model.extend({
	tableName: 'projects',
	idAttribute: 'id',
	validations: {
		name: ['required', 'string', 'maxLength:100'],
		description: ['required', 'string', 'maxLength:255'],
		repo: ['required', 'string', 'maxLength:255'],
		isPublished: ['boolean']
	}
});

Project.findByName = function (name) {
	name = name.toLowerCase();
	return Project.where({ name:name }).fetch();
};

/**
 * Finds an project by its ID
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
Project.findById = function (id) {
	return Project.where({ id:id }).fetch();
};

module.exports = Project;