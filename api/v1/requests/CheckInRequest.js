const Request = require('./Request');
const checkin = require('../utils/check_in');

const bodyRequired = ['location', 'swag', 'credentialsRequested'];
const bodyValidations = {
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
