var roles = require('../utils/roles');
var Request = require('./Request');

var bodyRequired = ['email', 'role'];
var bodyValidations = {
    'email': ['email'],
    'role': ['string', roles.verifyRole]
};

function AccreditedUserCreationRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyValidations = bodyValidations;
}

AccreditedUserCreationRequest.prototype = Object.create(Request.prototype);
AccreditedUserCreationRequest.prototype.constructor = AccreditedUserCreationRequest;

module.exports = AccreditedUserCreationRequest;
