const Request = require('./Request');

const bodyRequired = [ 'name' ];
const bodyValidations = {
  'name': ['required', 'string']
};

function EventDeleteRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

EventDeleteRequest.prototype = Object.create(Request.prototype);
EventDeleteRequest.prototype.constructor = EventDeleteRequest;

module.exports = EventDeleteRequest;
