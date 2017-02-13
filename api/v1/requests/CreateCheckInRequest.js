var Request = require('./Request');
var checkin = require('../utils/check_in');


var bodyRequired = ['location', 'swag'];
var bodyAllowed = [];
var bodyValidations = {
    location: ['required', 'string', checkin.verifyLocation],
    swag: ['required', 'boolean']
};


function CreateCheckInRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyAllowed = bodyAllowed;
    this.bodyValidations = bodyValidations;
};


CreateCheckInRequest.prototype = Object.create(Request.prototype);
CreateCheckInRequest.prototype.constructor = CreateCheckInRequest;

module.exports = CreateCheckInRequest;