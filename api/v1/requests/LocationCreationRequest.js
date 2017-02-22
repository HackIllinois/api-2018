var roles = require('../utils/roles');
var Request = require('./Request');

var bodyRequired = ['name, shortName, latitude, longitude'];
var bodyValidations = {
    'name': ['string', 'required', 'maxLength:255'],
    'shortName': ['required', 'string', 'maxLength:25'],
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