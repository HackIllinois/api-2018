var Request = require('./Request');
var checkin = require('../utils/check_in');

var bodyRequired = ['location', 'swag', 'credentialsRequested'];
var bodyValidations = {
	location: ['required', 'string', checkin.verifyLocation],
	credentialsRequested: ['required', 'boolean'],
	swag: ['required', 'boolean']
};

function CheckInRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

CheckInRequest.prototype = Object.create(Request.prototype);
CheckInRequest.prototype.constructor = CheckInRequest;

module.exports = CheckInRequest;
