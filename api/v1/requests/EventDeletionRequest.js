const Request = require('./Request');

const bodyRequired = [ 'name' ];
const bodyValidations = {
  'name': ['required', 'string']
};

function EventDeletionRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

EventDeletionRequest.prototype = Object.create(Request.prototype);
EventDeletionRequest.prototype.constructor = EventDeletionRequest;

module.exports = EventDeletionRequest;
