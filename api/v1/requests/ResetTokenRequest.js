const Request = require('./Request');

const bodyRequired = [ 'email' ];
const bodyValidations = {
  'email': [ 'email' ]
};

function ResetTokenRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

ResetTokenRequest.prototype = Object.create(Request.prototype);
ResetTokenRequest.prototype.constructor = ResetTokenRequest;

module.exports = ResetTokenRequest;
