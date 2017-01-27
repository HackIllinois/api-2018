var roles = require('../utils/roles');
var registration = require('../utils/registration');
var Request = require('./Request');

var bodyRequired = ['priority', 'wave', 'status'];
var bodyAllowed = ['reviewer', 'reviewTime', 'acceptedEcosystemId'];
var bodyValidations = {
	'priority':  ['required', 'integer', 'max:10'],
	'wave': 	 ['required', 'integer', 'max:5'],
	'status':    ['required', 'string', registration.verifyStatus],
	'reviewer':  ['string'],
	'reviewTime': ['integer'],
	'acceptedEcosystemId': ['integer']
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