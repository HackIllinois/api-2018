const Request = require('./Request');

const bodyRequired = [ 'isAttending' ];
const bodyValidations = {
  'isAttending': ['required', 'boolean']
};

function RSVPRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

RSVPRequest.prototype = Object.create(Request.prototype);
RSVPRequest.prototype.constructor = RSVPRequest;

module.exports = RSVPRequest;
