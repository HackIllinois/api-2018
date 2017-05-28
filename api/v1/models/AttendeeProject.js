var Model = require('./Model');
var AttendeeProject = Model.extend({
    tableName: 'attendee_projects',
    idAttribute: 'id',
    validations: {
        attendeeId: ['required', 'integer'],
        name: ['required', 'string', 'maxLength:100'],
        description: ['required', 'string', 'maxLength:255'],
        repo: ['required', 'string', 'maxLength:150'],
        isSuggestion: ['required', 'boolean']
    }
});


/**
 * Finds an attendee project by its relational attendee's id
 * @param  {Number|String} id	the ID of the attendee with the appropriate type
 * @return {Promise<Model>}	a Promise resolving to the resulting AttendeeProject or null
 */
AttendeeProject.findByAttendeeId = function(attendeeId) {
    return AttendeeProject.where({
        attendee_id: attendeeId
    })
    .fetch();
};

/**
 * Finds an attendee project by its ID
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
AttendeeProject.findById = function(id) {
    return AttendeeProject.where({
        id: id
    })
    .fetch();
};

module.exports = AttendeeProject;
