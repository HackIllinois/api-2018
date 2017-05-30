const registration = require('../utils/registration');
const Request = require('./Request');

const bodyRequired = ['priority', 'wave', 'status'];
const bodyAllowed = ['acceptanceType', 'acceptedEcosystemId'];
const bodyValidations = {
	'priority':  ['required', 'integer', 'max:10'],
	'wave': 	 ['required', 'integer', 'max:5'],
	'status':    ['required', 'string', registration.verifyStatus],
	'acceptedEcosystemId': ['integer'],
	'acceptanceType': ['string', registration.verifyAcceptanceType]
};

function AttendeeDecisionRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
	this.bodyAllowed = bodyAllowed;
}

AttendeeDecisionRequest.prototype = Object.create(Request.prototype);
AttendeeDecisionRequest.prototype.constructor = AttendeeDecisionRequest;

module.exports = AttendeeDecisionRequest;
