var registration = require('../utils/registration');

var Model = require('./Model');
var Mentor = Model.extend({
	tableName: 'mentors',
	idAttribute: 'id',
	validations: {
    first_name: ['required', 'string', 'maxLength:255'],
    last_name:  ['required', 'string', 'maxLength:255'],
		shirt_size: ['required', 'string', registration.verifyTshirtSize],
    github:     ['string', 'maxLength:50'],
    summary:    ['required', 'string', 'maxLength:255'],
    occupation: ['required', 'string', 'maxLength:255'],
    status:     ['required', 'string', registration.verifyStatus]
	}
});


/**
 * Finds a mentor by its relational user's id
 * @param  {Number|String} id	the ID of the user with the appropriate type
 * @return {Promise<Model>}	a Promise resolving to the resulting mentor or null
 */
Mentor.findByUserId = function (userId) {
	return Mentor.where({ user_id: userId }).fetch();
};

module.exports = Mentor;
