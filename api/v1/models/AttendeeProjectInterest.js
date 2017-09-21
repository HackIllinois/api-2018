const validators = require('../utils/validators');

const PROJECT_INTEREST_TYPES = ['CREATE', 'CONTRIBUTE', 'SUGGEST'];

const Model = require('./Model');
const AttendeeProjectInterest = Model.extend({
  tableName: 'attendee_project_interests',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    type: ['required', 'string', validators.in(PROJECT_INTEREST_TYPES)],
    projectId: ['required', 'integer'],
    attendeeProjectId: [ 'integer' ]
  }
});


/**
 * Finds an attendee project interest by its relational attendee's id
 * @param  {Number|String} id	the ID of the attendee with the appropriate type
 * @return {Promise<Model>}	a Promise resolving to the resulting AttendeeProjectInterest or null
 */
AttendeeProjectInterest.findByAttendeeId = function(attendeeId) {
  return AttendeeProjectInterest.where({
    attendee_id: attendeeId
  })
    .fetch();
};

/**
 * Finds an attendee project interest by its ID
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
AttendeeProjectInterest.findById = function(id) {
  return AttendeeProjectInterest.where({
    id: id
  })
    .fetch();
};

module.exports = AttendeeProjectInterest;
