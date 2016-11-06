var Model = require('./Model');

var Project = Model.extend({
	tableName: 'projects',
	idAttribute: 'id',
	validations: {
		name: ['required', 'string', 'maxLength:100'],
		description: ['required', 'string', 'maxLength:200'],
		repo: ['string', 'maxLength:255'],
		is_published: ['boolean']
	}
});

Project.findByName = function (name) {
	name = name.toLowerCase();
	return Project.where({ name:name }).fetch();
}

Project.findById = function (id) {
	return Project.where({ id:id }).fetch();
}

module.exports = Project;