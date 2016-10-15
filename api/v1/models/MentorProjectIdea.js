var Model = require('./Model');
var MentorProjectIdea = Model.extend({
	tableName: 'mentor_project_ideas',
	idAttribute: 'id',
	validations: {
    link:           ['required', 'url', 'maxLength:255'],
    contributions:  ['required', 'string', 'maxLength:255'],
    ideas:          ['required', 'string', 'maxLength:255'],
		mentor_id:    ['required', 'integer']
	}
});

module.exports = MentorProjectIdea;
