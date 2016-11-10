var _ = require('lodash');

var Model = require('./Model');
var Project = Model.extend({
	tableName: 'projects',
	idAttribute: 'id'
});

/**
* Finds an project by its ID
* @param  {Number|String} id	the ID of the model with the appropriate type
* @return {Promise<Model>}		a Promise resolving to the resulting model or null
*/
Project.findById = function (id) {
	return Project.where({ id: id }).fetch();
};

module.exports = Project;
