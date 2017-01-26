var Request = require('./Request');

var bodyRequired = ['userId'];
var bodyAllowed = ['checkedIn', 'travel', 'location', 'swag'];
var bodyValidations = {
    checkedIn: ['required', 'boolean'],
    travel: ['required', 'string', registration.verifyTransportation],
    location: ['required', 'string', registration.verifyLocation],
    swag: ['required', 'boolean']
};


function CheckInRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyAllowed = bodyAllowed;
    this.bodyValidations = bodyValidations;
};


CheckInRequest.prototype = Object.create(Request.prototype);
CheckInRequest.prototype.constructor = CheckInRequest;

module.exports = CheckInRequest;