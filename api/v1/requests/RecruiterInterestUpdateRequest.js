const Request = require('./Request');

const bodyRequired = ['appId'];
const bodyAllowed = [ 'comments', 'favorite']
const bodyValidations = {
  'appId': ['required', 'naturalNonZero'],
  'comments': ['string', 'maxLength:255'],
  'favorite': ['natural']
};

function RecruiterInterestUpdateRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
  this.bodyAllowed = bodyAllowed
}

RecruiterInterestUpdateRequest.prototype = Object.create(Request.prototype);
RecruiterInterestUpdateRequest.prototype.constructor = RecruiterInterestUpdateRequest;

module.exports = RecruiterInterestUpdateRequest;
