const Model = require('./Model');
const AttendeeLongForm = Model.extend({
  tableName: 'attendee_long_form',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    info: ['required', 'string', 'maxLength:16383']
  }
});

/**
 * Finds an attendee's extra information by its relational attendee's id
 * @param  {Number|String} id	the ID of the attendee with the appropriate type
 * @return {Promise<Model>}	a Promise resolving to the resulting AttendeeLongForm or null
 */
AttendeeLongForm.findByAttendeeId = (attendeeId) => AttendeeLongForm.where({
  attendee_id: attendeeId
})
  .fetch();

/**
 * Finds an attendee's extra information by its ID
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
AttendeeLongForm.findById = (id) => AttendeeLongForm.where({
  id: id
})
  .fetch();

module.exports = AttendeeLongForm;
