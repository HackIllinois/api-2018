const Request = require('./Request');

const bodyRequired = [ 'newEmail' ];
const bodyValidations = {
  'newEmail': [ 'email' ]
};

function UserContactInfoRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

UserContactInfoRequest.prototype = Object.create(Request.prototype);
UserContactInfoRequest.prototype.constructor = UserContactInfoRequest;

module.exports = UserContactInfoRequest;
