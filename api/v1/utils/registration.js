var _ = require('lodash');
var _Promise = require('bluebird');

var TSHIRT_SIZES = ['S', 'M', 'L', 'XL'];
var STATUSES = ['ACCEPTED', 'WAITLISTED', 'REJECTED', 'PENDING'];
var DIETS = ['NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'];
var PROFESSIONAL_INTERESTS = ['INTERNSHIP', 'FULLTIME', 'BOTH'];
var GENDERS = ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'];
var TRANSPORTATION_OPTIONS = ['NOT_NEEDED', 'BUS_REQUESTED', 'IN_STATE', 'OUT_OF_STATE', 'INTERNATIONAL'];
var PROJECT_INTEREST_TYPES = ['CREATE', 'CONTRIBUTE', 'SUGGEST'];
var CATEGORIES = ['first_name', 'last_name', 'graduation_year', 'school', 'status', 'wave', 'finalized']

/**
 * Ensures that the provided tshirt-size is in the list
 * of valid size options
 * @param  {String} size the value to check
 * @return {Boolean} true when the size is valid
 * @throws TypeError when the size is invalid
 */
module.exports.verifyTshirtSize = function (size) {
	if (!_.includes(TSHIRT_SIZES, size)) {
		throw new TypeError(size + " is not a valid size");
	}

	return true;
};

/**
 * Ensures that the provided diet is in the list
 * of valid diet options
 * @param  {String} diet the value to check
 * @return {Boolean} true when the diet is valid
 * @throws TypeError when the diet is invalid
 */
module.exports.verifyDiet = function(diet){
	if (!_.includes(DIETS, diet)) {
		throw new TypeError(diet + " is not a valid diet");
	}

	return true;
}

/**
 * Ensures that the provided transportation option is in the list
 * of valid transportation options
 * @param  {String} transportation the option to check
 * @return {Boolean} true when the transportation option is valid
 * @throws TypeError when the transportation option is invalid
 */
module.exports.verifyTransportation = function(transportation){
	if (!_.includes(TRANSPORTATION_OPTIONS, transportation)) {
		throw new TypeError(transportation + " is not a valid transportation option");
	}

	return true;
}

/**
 * Ensures that the provided gender is in the list
 * of valid gender options
 * @param  {String} gender the option to check
 * @return {Boolean} true when the gender option is valid
 * @throws TypeError when the gender option is invalid
 */
module.exports.verifyGender = function(gender){
	if (!_.includes(GENDERS, gender)) {
		throw new TypeError(gender + " is not a valid gender option");
	}

	return true;
}

/**
 * Ensures that the provided professional interest is in the list
 * of valid professional interest options
 * @param  {String} professionalInterest the option to check
 * @return {Boolean} true when the professional interest option is valid
 * @throws TypeError when the professional interest option is invalid
 */
module.exports.verifyProfessionalInterest = function(professionalInterest){
	if (!_.includes(PROFESSIONAL_INTERESTS, professionalInterest)) {
		throw new TypeError(professionalInterest + " is not a valid professional interest option");
	}

	return true;
}

/**
 * Ensures that the provided project interest type is in the list
 * of valid project interest type options
 * @param  {String} projectInterestType the option to check
 * @return {Boolean} true when the project interest type option is valid
 * @throws TypeError when the project interest type option is invalid
 */
module.exports.verifyProjectInterestType = function(projectInterestType){
	if (!_.includes(PROJECT_INTEREST_TYPES, projectInterestType)) {
		throw new TypeError(projectInterestType + " is not a valid project interest type");
	}

	return true;
}

/**
 * Ensures that the provided project array only has one suggestion and one creation
 * @param  {Array} projectArray the array of projects to check
 * @return {Boolean} true when the project array is valid
 * @throws TypeError when the project array is invalid
 */
module.exports.verifyProjectArray = function(projectArray){
	if (_.filter(projectArray, ['isSuggestion', false]).length > 1){
		throw new TypeError("The projects supplied are invalid. Attendees can only create 1 project at most.");
	}

	return true;
}

/**
 * Ensures that the provided status is in the list
 * of valid status options
 * @param  {String} size the value to check
 * @return {Boolean} true when the status is valid
 * @throws TypeError when the status is invalid
 */
module.exports.verifyStatus = function (status) {
	if (!_.includes(STATUSES, status)) {
		throw new TypeError(status + " is not a valid status");
	}

	return true;
};

/**
 * Ensures that the provided category is in the list
 * of valid categories
 * @param  {String} category the value to check
 * @return {Boolean} true when the category is valid
 * @throws TypeError when the category is invalid
 */
module.exports.verifyCategory = function (category) {
	if (!_.includes(CATEGORIES, category)) {
		return false;
	}

	return true;
};
