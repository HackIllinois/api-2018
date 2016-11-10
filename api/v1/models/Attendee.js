var _ = require('lodash');
var registration = require('../utils/registration');

var Model = require('./Model');
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
        transportation: ['required', 'string', registration.verifyTransportation],
		school:    ['required', 'string', 'maxLength:255'],
		major:     ['required', 'string', 'maxLength:255'],
        gender:    ['required', 'string', registration.verifyGender],
        isNovice:  ['required', 'boolean'],
        professionalInterest: ['required', 'string', registration.verifyProfessionalInterest],
        github:    ['required', 'string', 'maxLength:50'],
        interests: ['required', 'string', 'maxLength:255'],
        status:    ['string', registration.verifyStatus]
	}
});


/**
* Finds an attendee by its relational user's id, joining in its related project ideas
* @param  {Number|String} id	the ID of the attendee with the appropriate type
* @return {Promise<Model>}	a Promise resolving to the resulting Attendee or null
*/
Attendee.findByUserId = function (userId) {
	return Attendee.where({ user_id: userId }).fetch();
};

/**
* Finds an attendee by its ID, joining in its related project ideas
* @param  {Number|String} id	the ID of the model with the appropriate type
* @return {Promise<Model>}		a Promise resolving to the resulting model or null
*/
Attendee.findById = function (id) {
	return Attendee.where({ id: id }).fetch();
};

module.exports = Attendee;
