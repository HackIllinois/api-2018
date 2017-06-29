const Request = require('./Request');

const bodyRequired = ['title', 'description'];
const bodyValidations = {
  'title': ['required', 'string', 'maxLength:255'],
  'description': ['required', 'string', 'maxLength:1000']
};

function AnnouncementRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

AnnouncementRequest.prototype = Object.create(Request.prototype);
AnnouncementRequest.prototype.constructor = AnnouncementRequest;

module.exports = AnnouncementRequest;
