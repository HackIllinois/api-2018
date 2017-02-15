var Request = require('./Request');
var checkin = require('../utils/check_in');


var bodyAllowed = ['swag', 'location'];
var bodyValidations = {
    location: ['string', checkin.verifyLocation],
    swag: ['boolean']
};


function UpdateCheckInRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyAllowed = bodyAllowed;
    this.bodyValidations = bodyValidations;
};


UpdateCheckInRequest.prototype = Object.create(Request.prototype);
UpdateCheckInRequest.prototype.constructor = UpdateCheckInRequest;

module.exports = UpdateCheckInRequest;