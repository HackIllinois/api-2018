var _ = require('lodash');
var registration = require('../utils/registration');

var Model = require('./Model');
var AttendeeProjectInterest = require('./AttendeeProjectInterest');
var AttendeeProject = require('./AttendeeProject');
var AttendeeExtraInfo = require('./AttendeeExtraInfo');
var AttendeeRequestedCollaborator = require('./AttendeeRequestedCollaborator');
var Attendee = Model.extend({
	tableName: 'attendees',
	idAttribute: 'id',
	validations: {
		userId:    ['required', 'integer'],
		firstName: ['required', 'string', 'maxLength:255'],
		lastName:  ['required', 'string', 'maxLength:255'],
		shirtSize: ['required', 'string', registration.verifyTshirtSize],
        diet:       ['required', 'string', registration.verifyDiet],
        age:       ['required', 'integer', 'min:13', 'max:115'],
        transportation: ['required', 'string', registration.verifyTransportation],
		school:    ['required', 'string', 'maxLength:255'],
		major:     ['required', 'string', 'maxLength:255'],
        gender:    ['required', 'string', registration.verifyGender],
        isNovice:  ['required', 'boolean'],
        professionalInterest: ['required', 'string', registration.verifyProfessionalInterest],
        github:    ['required', 'string', 'maxLength:50'],
        interests: ['required', 'string', 'maxLength:255'],
        status:    ['string', registration.verifyStatus]
	},
	interests: function () {
		return this.hasMany(AttendeeProjectInterest);
	},
	projects: function () {
		return this.hasMany(AttendeeProject);
	},
	extras: function () {
		return this.hasMany(AttendeeExtraInfo);
	},
	collaborators: function () {
		return this.hasMany(AttendeeRequestedCollaborator);
	}
});


/**
* Finds an attendee by its relational user's id, joining in its related project ideas
* @param  {Number|String} id	the ID of the attendee with the appropriate type
* @return {Promise<Model>}	a Promise resolving to the resulting Attendee or null
*/
Attendee.findByUserId = function (userId) {
	return Attendee.where({ user_id: userId }).fetch({withRelated: ['interests', 'projects', 'extras', 'collaborators']});
};

/**
* Finds an attendee by its ID, joining in its related project ideas
* @param  {Number|String} id	the ID of the model with the appropriate type
* @return {Promise<Model>}		a Promise resolving to the resulting model or null
*/
Attendee.findById = function (id) {
	return Attendee.where({ id: id }).fetch({withRelated: ['interests', 'projects', 'extras', 'collaborators']});
};

module.exports = Attendee;
