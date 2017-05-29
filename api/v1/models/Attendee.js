var _ = require('lodash');
var registration = require('../utils/registration');
var utils = require('../utils');

var Model = require('./Model');
var Upload = require('./Upload');
var AttendeeProjectInterest = require('./AttendeeProjectInterest');
var AttendeeProject = require('./AttendeeProject');
var AttendeeExtraInfo = require('./AttendeeExtraInfo');
var AttendeeEcosystemInterest = require('./AttendeeEcosystemInterest');
var AttendeeRequestedCollaborator = require('./AttendeeRequestedCollaborator');
var AttendeeRSVP = require('./AttendeeRSVP');
var Attendee = Model.extend({
	tableName: 'attendees',
	idAttribute: 'id',
	validations: {
		userId: ['required', 'integer'],
		firstName: ['required', 'string', 'maxLength:255'],
		lastName: ['required', 'string', 'maxLength:255'],
		shirtSize: ['required', 'string', registration.verifyTshirtSize],
		diet: ['required', 'string', registration.verifyDiet],
		age: ['required', 'integer', 'min:13', 'max:115'],
		graduationYear: ['required', 'integer', 'min:2017', 'max:2024'],
		transportation: ['required', 'string', registration.verifyTransportation],
		school: ['required', 'string', 'maxLength:255'],
		major: ['required', 'string', 'maxLength:255'],
		gender: ['required', 'string', registration.verifyGender],
		professionalInterest: ['required', 'string', registration.verifyProfessionalInterest],
		github: ['required', 'string', 'maxLength:50'],
		linkedin: ['required', 'string', 'maxLength:50'],
		interests: ['required', 'string', 'maxLength:255'],
		priority: ['integer', 'max:10'],
		status: ['string', registration.verifyStatus],
		wave: ['integer', 'max:5'],
		reviewer: ['string'],
		reviewTime: ['date'],
		isNovice: ['required', 'boolean'],
		isPrivate: ['required', 'boolean'],
		phoneNumber: ['string', 'maxLength:15'],
		acceptanceType: ['string', registration.verifyAcceptanceType],
		acceptedEcosystemId: ['integer']
	},
	interests: function() {
		return this.hasMany(AttendeeProjectInterest);
	},
	projects: function() {
		return this.hasMany(AttendeeProject);
	},
	ecosystemInterests: function() {
		return this.hasMany(AttendeeEcosystemInterest);
	},
	extras: function() {
		return this.hasMany(AttendeeExtraInfo);
	},
	collaborators: function() {
		return this.hasMany(AttendeeRequestedCollaborator);
	},
	rsvp: function() {
		return this.hasOne(AttendeeRSVP);
	},
	parse: function(attrs) {
		attrs = Model.prototype.parse(attrs);
		attrs.isNovice = !!attrs.isNovice;
		attrs.isPrivate = !!attrs.isPrivate;
		return attrs;
	}
});


/**
 * Finds an attendee by its relational user's id, joining in its related project ideas
 * @param  {Number|String} userId	the ID of the attendee's relational user
 * @return {Promise<Model>}	a Promise resolving to the resulting Attendee or null
 */
Attendee.findByUserId = function(userId) {
	return Attendee.where({
		user_id: userId
	})
    .fetch({
	withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators', 'rsvp']
});
};


/**
 * Same as Attendee.findByUserId, only appending a resume object to the result
 * @param  {Number|String} userId	the ID of the attendee's relational user
 * @return {Promise<Model>}	a Promise resolving to the resulting Attendee or null
 */
Attendee.fetchWithResumeByUserId = function(userId) {
	return Attendee.transaction(function(t) {
		var attendee;
		return Attendee.where({
			user_id: userId
		})
      .fetch({
	withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators', 'rsvp'],
	transacting: t
})
      .then(function(a) {
	attendee = a;
	if (_.isNull(a)) {
		return null;
	}
	return Upload.where({
		owner_id: userId,
		bucket: utils.storage.buckets.resumes
	})
          .fetch({
	transacting: t
});
})
      .then(function(u) {
	if (!_.isNull(u)) {
		attendee.set('resume', (u !== null) ? u.attributes : u);
	}
	return attendee;
});
	});
};

/**
 * Finds an attendee by its ID, joining in its related project ideas
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
Attendee.findById = function(id) {
	return Attendee.where({
		id: id
	})
    .fetch({
	withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators', 'rsvp']
});
};

/**
 * Same as Attendee.findById, only appending a resume object to the result
 * @param  {Number|String} id	the ID of the attendee with the appropriate type
 * @return {Promise<Model>}	a Promise resolving to the resulting Attendee or null
 */
Attendee.fetchWithResumeById = function(id) {
	return Attendee.transaction(function(t) {
		var attendee;
		return Attendee.where({
			id: id
		})
      .fetch({
	withRelated: ['projects', 'ecosystemInterests', 'extras', 'collaborators', 'rsvp'],
	transacting: t
})
      .then(function(a) {
	attendee = a;
	if (_.isNull(a)) {
		return null;
	}
	return Upload.where({
		owner_id: a.get('userId'),
		bucket: utils.storage.buckets.resumes
	})
          .fetch({
	transacting: t
});
})
      .then(function(u) {
	if (!_.isNull(u)) {
		attendee.set('resume', (u !== null) ? u.attributes : u);
	}
	return attendee;
});
	});
};

module.exports = Attendee;
