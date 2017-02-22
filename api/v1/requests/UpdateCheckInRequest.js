var Request = require('./Request');
var checkin = require('../utils/check_in');

var bodyRequired = [];
var bodyAllowed = ['location', 'swag'];
var bodyValidations = {
    location: ['string', checkin.verifyLocation],
    swag: ['boolean']
};


function UpdateCheckInRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyAllowed = bodyAllowed;
    this.bodyValidations = bodyValidations;
};


UpdateCheckInRequest.prototype = Object.create(Request.prototype);
UpdateCheckInRequest.prototype.constructor = UpdateCheckInRequest;

module.exports = UpdateCheckInRequest;
