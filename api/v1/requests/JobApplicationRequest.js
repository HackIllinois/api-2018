const Request = require('./Request');

const bodyRequired = ['applicantId'];
const bodyValidations = {
  'applicantId': ['required', 'naturalNonZero'],
  'comments': ['string', 'maxLength:255'],
  'favorite': ['natural']
};

function JobApplicationRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

JobApplicationRequest.prototype = Object.create(Request.prototype);
JobApplicationRequest.prototype.constructor = JobApplicationRequest;

module.exports = JobApplicationRequest;
