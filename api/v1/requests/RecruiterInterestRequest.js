const Request = require('./Request');

const bodyRequired = ['applicantId'];
const bodyAllowed = ['comments', 'favorite'];
const bodyValidations = {
  'applicantId': ['required', 'naturalNonZero'],
  'comments': ['string', 'maxLength:255'],
  'favorite': ['natural']
};

function RecruiterInterestRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
  this.bodyAllowed = bodyAllowed;
}

RecruiterInterestRequest.prototype = Object.create(Request.prototype);
RecruiterInterestRequest.prototype.constructor = RecruiterInterestRequest;

module.exports = RecruiterInterestRequest;
