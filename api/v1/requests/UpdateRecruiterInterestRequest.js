const Request = require('./Request');

const bodyRequired = [];
const bodyAllowed = ['comments', 'favorite'];
const bodyValidations = {
  'comments': ['string', 'maxLength:255'],
  'favorite': [ 'boolean' ]
};

function UpdateRecruiterInterestRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
  this.bodyAllowed = bodyAllowed;
}

UpdateRecruiterInterestRequest.prototype = Object.create(Request.prototype);
UpdateRecruiterInterestRequest.prototype.constructor = UpdateRecruiterInterestRequest;

module.exports = UpdateRecruiterInterestRequest;
