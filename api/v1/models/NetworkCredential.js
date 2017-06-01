const Model = require('./Model');
const NetworkCredential = Model.extend({
  tableName: 'network_credentials',
  idAttribute: 'id',
  validations: {
    userId: [ 'integer' ],
    account: ['required', 'string', 'maxLength:25'],
    password: ['required', 'string', 'maxLength:25'],
    assigned: ['required', 'boolean']
  }
});


/**
 * Finds a network credential by its relational user's id
 * @param  {Number|String} userId	the ID of the attendee's relational user
 * @return {Promise<Model>}	a Promise resolving to the resulting NetworkCredential or null
 */
NetworkCredential.findByUserId = function(userId) {
  return NetworkCredential.where({
    user_id: userId
  })
		.fetch();
};
/**
 * Finds a network credential by its ID
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
NetworkCredential.findById = function(id) {
  return NetworkCredential.where({
    id: id
  })
		.fetch();
};

/**
 * Finds an unassigned network credential
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
NetworkCredential.findUnassigned = function() {
  return NetworkCredential.where({
    assigned: 0
  })
		.fetch();
};

module.exports = NetworkCredential;
