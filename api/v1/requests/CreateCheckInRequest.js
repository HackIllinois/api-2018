var Request = require('./Request');
var checkin = require('../utils/check_in');


var bodyRequired = ['location', 'swag', 'credentialsRequested'];
var bodyValidations = {
    location: ['required', 'string', checkin.verifyLocation],
    credentialsRequested: ['required', 'boolean'],
    swag: ['required', 'boolean']
};


function CreateCheckInRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyValidations = bodyValidations;
};


CreateCheckInRequest.prototype = Object.create(Request.prototype);
CreateCheckInRequest.prototype.constructor = CreateCheckInRequest;

module.exports = CreateCheckInRequest;
