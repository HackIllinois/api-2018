const Request = require('./Request');

const bodyRequired = [ 'eventId' ];
const bodyValidations = {
  'eventId': ['required', 'number']
};

function EventDeletionRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

EventDeletionRequest.prototype = Object.create(Request.prototype);
EventDeletionRequest.prototype.constructor = EventDeletionRequest;

module.exports = EventDeletionRequest;
