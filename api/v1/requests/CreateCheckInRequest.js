var Request = require('./Request');
var checkin = require('../utils/check_in');


var bodyRequired = ['userId', 'location', 'swag'];
var bodyAllowed = [];
var bodyValidations = {
    userId: ['required', 'integer'],
    location: ['required', 'string', checkin.verifyLocation],
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