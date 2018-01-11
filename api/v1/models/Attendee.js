const _ = require('lodash');
const storage = require('../utils/storage');
const validators = require('../utils/validators');

const TSHIRT_SIZES = ['S', 'M', 'L', 'XL'];
const STATUSES = ['ACCEPTED', 'WAITLISTED', 'REJECTED', 'PENDING'];
const DIETS = ['NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'];
const PROFESSIONAL_INTERESTS = ['NONE', 'INTERNSHIP', 'FULLTIME', 'BOTH'];
const GENDERS = ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'];
const TRANSPORTATION_OPTIONS = ['NOT_NEEDED', 'BUS_REQUESTED', 'IN_STATE', 'OUT_OF_STATE', 'INTERNATIONAL'];
const ACCEPTANCE_TYPES = ['CREATE', 'CONTRIBUTE'];

const Model = require('./Model');
const Upload = require('./Upload');
const AttendeeProjectInterest = require('./AttendeeProjectInterest');
const AttendeeProject = require('./AttendeeProject');
const AttendeeExtraInfo = require('./AttendeeExtraInfo');
const AttendeeEcosystemInterest = require('./AttendeeEcosystemInterest');
const AttendeeRequestedCollaborator = require('./AttendeeRequestedCollaborator');
const AttendeeRSVP = require('./AttendeeRSVP');
const AttendeeWebsite = require('./AttendeeWebsite');
const AttendeeOSContributor = require('./AttendeeOSContributor');
const Attendee = Model.extend({
  tableName: 'attendees',
  idAttribute: 'id',
  validations: {
    userId: ['required', 'integer'],
    firstName: ['required', 'string', 'maxLength:255'],
    lastName: ['required', 'string', 'maxLength:255'],
    shirtSize: ['required', 'string', validators.in(TSHIRT_SIZES)],
    diet: ['required', 'string', validators.in(DIETS)],
    age: ['required', 'integer', 'min:13', 'max:115'],
    graduationYear: ['required', 'integer', 'min:2017', 'max:2024'],
    transportation: ['required', 'string', validators.in(TRANSPORTATION_OPTIONS)],
    school: ['required', 'string', 'maxLength:255'],
    major: ['required', 'string', 'maxLength:255'],
    gender: ['required', 'string', validators.in(GENDERS)],
    professionalInterest: ['required', 'string', validators.in(PROFESSIONAL_INTERESTS)],
    github: ['required', 'string', 'maxLength:50'],
    linkedin: ['required', 'string', 'maxLength:50'],
    interests: ['required', 'string', 'maxLength:255'],
    priority: ['integer', 'max:10'],
    status: ['string', validators.in(STATUSES)],
    wave: ['integer', 'max:5'],
    reviewer: [ 'string' ],
    reviewTime: [ 'date' ],
    isNovice: ['required', 'boolean'],
    isPrivate: ['required', 'boolean'],
    phoneNumber: ['string', 'maxLength:15'],
    acceptanceType: ['string', validators.in(ACCEPTANCE_TYPES)],
    acceptedEcosystemId: [ 'integer' ]
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
  websites: function() {
    return this.hasMany(AttendeeWebsite);
  },
  osContributors: function() {
    return this.hasMany(AttendeeOSContributor);
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
      withRelated: ['projects', 'ecosystemInterests', 'extras', 'websites', 'osContributors', 'collaborators', 'rsvp']
    });
};


/**
 * Same as Attendee.findByUserId, only appending a resume object to the result
 * @param  {Number|String} userId	the ID of the attendee's relational user
 * @return {Promise<Model>}	a Promise resolving to the resulting Attendee or null
 */
Attendee.fetchWithResumeByUserId = function(userId) {
  return Attendee.transaction((t) => {
    let attendee;
    return Attendee.where({
      user_id: userId
    })
      .fetch({
        withRelated: ['projects', 'ecosystemInterests', 'extras', 'websites', 'osContributors', 'collaborators', 'rsvp'],
        transacting: t
      })
      .then((a) => {
        attendee = a;
        if (_.isNull(a)) {
          return null;
        }
        return Upload.where({
          owner_id: userId,
          bucket: storage.buckets.resumes
        })
          .fetch({
            transacting: t
          });
      })
      .then((u) => {
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
      withRelated: ['projects', 'ecosystemInterests', 'extras', 'websites', 'osContributors', 'collaborators', 'rsvp']
    });
};

/**
 * Same as Attendee.findById, only appending a resume object to the result
 * @param  {Number|String} id	the ID of the attendee with the appropriate type
 * @return {Promise<Model>}	a Promise resolving to the resulting Attendee or null
 */
Attendee.fetchWithResumeById = function(id) {
  return Attendee.transaction((t) => {
    let attendee;
    return Attendee.where({
      id: id
    })
      .fetch({
        withRelated: ['projects', 'ecosystemInterests', 'extras', 'websites', 'osContributors', 'collaborators', 'rsvp'],
        transacting: t
      })
      .then((a) => {
        attendee = a;
        if (_.isNull(a)) {
          return null;
        }
        return Upload.where({
          owner_id: a.get('userId'),
          bucket: storage.buckets.resumes
        })
          .fetch({
            transacting: t
          });
      })
      .then((u) => {
        if (!_.isNull(u)) {
          attendee.set('resume', (u !== null) ? u.attributes : u);
        }
        return attendee;
      });
  });
};

module.exports = Attendee;
