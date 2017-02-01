var Request = require('./Request');
var checkin = require('../utils/check_in');


var bodyRequired = [];
var bodyAllowed = ['checkedIn', 'location', 'swag'];
var bodyValidations = {
    checkedIn: ['boolean'],
    location: ['string', checkin.verifyLocation],
    swag: ['boolean']
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