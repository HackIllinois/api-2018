const Model = require('./Model');
const AttendeeExtraInfo = Model.extend({
  tableName: 'attendee_extra_infos',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    info: ['required', 'string', 'maxLength:255']
  }
});

/**
 * Finds an attendee's extra information by its relational attendee's id
 * @param  {Number|String} id the ID of the attendee with the appropriate type
 * @return {Promise<Model>} a Promise resolving to the resulting AttendeeExtraInfo or null
 */
AttendeeExtraInfo.findByAttendeeId = (attendeeId) => AttendeeExtraInfo.where({
  attendee_id: attendeeId
})
  .fetch();

/**
 * Finds an attendee's extra information by its ID
 * @param  {Number|String} id the ID of the model with the appropriate type
 * @return {Promise<Model>}   a Promise resolving to the resulting model or null
 */
AttendeeExtraInfo.findById = (id) => AttendeeExtraInfo.where({
  id: id
})
  .fetch();

module.exports = AttendeeExtraInfo;
