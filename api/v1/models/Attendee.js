var _ = require('lodash');
var registration = require('../utils/registration');
var utils = require('../utils');

var Model = require('./Model');
var User = require('./User');
var Upload = require('./Upload');
var AttendeeProjectInterest = require('./AttendeeProjectInterest');
var AttendeeProject = require('./AttendeeProject');
var AttendeeExtraInfo = require('./AttendeeExtraInfo');
var AttendeeEcosystemInterest = require('./AttendeeEcosystemInterest');
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
		graduationYear: ['required', 'integer', 'min:2017', 'max:2024'],
		transportation: ['required', 'string', registration.verifyTransportation],
		school:    ['required', 'string', 'maxLength:255'],
		major:     ['required', 'string', 'maxLength:255'],
		gender:    ['required', 'string', registration.verifyGender],
		professionalInterest: ['required', 'string', registration.verifyProfessionalInterest],
		github:    ['required', 'string', 'maxLength:50'],
		linkedin:  ['required', 'string', 'maxLength:50'],
		interests: ['required', 'string', 'maxLength:255'],
		status:    ['string', registration.verifyStatus],
		isNovice:  ['required', 'boolean'],
		isPrivate:  ['required', 'boolean'],
		phoneNumber: ['string', 'maxLength:15']
	},
	interests: function () {
		return this.hasMany(AttendeeProjectInterest);
	},
	projects: function () {
		return this.hasMany(AttendeeProject);
	},
	ecosystemInterests: function () {
		return this.hasMany(AttendeeEcosystemInterest);
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
	return Attendee.where({ user_id: userId }).fetch({withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators']});
};

Attendee.fetchWithResumeByUserId = function (userId) {
	return Attendee.transaction(function (t){
		var attendee;
	    return Attendee.where({ user_id: userId })
		.fetch({withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators'], transacting: t})
		.then(function (a) {
			attendee = a;
			return Upload.where({ owner_id: a.get('userId') }).fetch({transacting: t});
	    })
		.then(function (u) {
			attendee.set('resume', u.attributes);
			return attendee;
		});
	});
};

/**
* Finds an attendee by its ID, joining in its related project ideas
* @param  {Number|String} id	the ID of the model with the appropriate type
* @return {Promise<Model>}		a Promise resolving to the resulting model or null
*/
Attendee.findById = function (id) {
	return Attendee.where({ id: id }).fetch({withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators']});
};

Attendee.fetchWithResumeById = function (id) {
	return Attendee.transaction(function (t){
		var attendee;
		return Attendee.where({ id: id })
		.fetch({withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators'], transacting: t})
		.then(function (a) {
			attendee = a;
			return Upload.where({ owner_id: a.get('userId') }).fetch({transacting: t});
	    })
		.then(function (u) {
			  attendee.set('resume', u.attributes);
			  return attendee;
    	});
	});
};


module.exports = Attendee;
