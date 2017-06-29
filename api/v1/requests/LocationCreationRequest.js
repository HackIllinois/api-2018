const Request = require('./Request');

const bodyRequired = ['name', 'latitude', 'longitude'];
const bodyValidations = {
  'name': ['required', 'string', 'maxLength:255'],
  'latitude': ['required', 'number'],
  'longitude': ['required', 'number']
};

function LocationCreationRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

LocationCreationRequest.prototype = Object.create(Request.prototype);
LocationCreationRequest.prototype.constructor = LocationCreationRequest;

module.exports = LocationCreationRequest;
