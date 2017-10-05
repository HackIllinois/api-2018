const Request = require('./Request');
const CheckIn = require('../models/CheckIn');

const bodyRequired = ['location', 'swag', 'credentialsRequested'];
const checkin = new CheckIn();
const bodyValidations = {
  location: checkin.validations.location,
  credentialsRequested: ['required', 'boolean'],
  swag: checkin.validations.swag
};

function CheckInRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

CheckInRequest.prototype = Object.create(Request.prototype);
CheckInRequest.prototype.constructor = CheckInRequest;

module.exports = CheckInRequest;
