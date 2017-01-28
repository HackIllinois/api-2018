var Request = require('./Request');


var bodyRequired = [];
var bodyAllowed = ['checked_in', 'location', 'swag'];
var bodyValidations = {
    user_d: ['required', 'integer'],
    checkedIn: ['required', 'boolean'],
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