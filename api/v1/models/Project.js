var Model = require('./Model');

var Project = Model.extend({
	tableName: 'projects',
	idAttribute: 'id',
	validations: {
		name: ['required', 'string', 'maxLength:100'],
		description: ['required', 'string', 'maxLength:200'],
		repo: ['string', 'maxLength:255'],
		is_published: ['required', 'boolean']
	}
});

module.exports Project;