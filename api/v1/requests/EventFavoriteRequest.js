const Request = require('./Request');

const bodyRequired = [ 'eventId' ];
const bodyValidations = {
  'eventId': ['required', 'number']
};

function EventFavoriteRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

EventFavoriteRequest.prototype = Object.create(Request.prototype);
EventFavoriteRequest.prototype.constructor = EventFavoriteRequest;

module.exports = EventFavoriteRequest;
