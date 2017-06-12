const Request = require('./Request');

const bodyRequired = ['token', 'password'];
const bodyValidations = {
  'token': [ 'string' ],
  'password': ['string', 'minLength:8', 'maxLength:50']
};

function ResetPasswordRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

ResetPasswordRequest.prototype = Object.create(Request.prototype);
ResetPasswordRequest.prototype.constructor = ResetPasswordRequest;

module.exports = ResetPasswordRequest;
