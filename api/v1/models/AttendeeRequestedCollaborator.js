var _ = require('lodash');


var Model = require('./Model');
var AttendeeRequestedCollaborator = Model.extend({
	tableName: 'attendee_requested_collaborators',
	idAttribute: 'id',
	validations: {
        attendeeId:   ['required', 'integer'],
        collaborator: ['required', 'string', 'maxLength:255']
	}
});


/**
* Finds an attendee's requested collaborator by its relational attendee's id
* @param  {Number|String} id	the ID of the attendee with the appropriate type
* @return {Promise<Model>}	a Promise resolving to the resulting AttendeeRequestedCollaborator or null
*/
AttendeeRequestedCollaborator.findByAttendeeId = function (userId) {
	return AttendeeRequestedCollaborator.where({ attendee_id: attendeeId }).fetch();
};

/**
* Finds an attendee's requested collaborator by its ID
* @param  {Number|String} id	the ID of the model with the appropriate type
* @return {Promise<Model>}		a Promise resolving to the resulting model or null
*/
AttendeeRequestedCollaborator.findById = function (id) {
	return AttendeeRequestedCollaborator.where({ id: id }).fetch();
};

module.exports = AttendeeRequestedCollaborator;
