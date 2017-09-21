const Request = require('./Request');
const mailUtils = require('../utils/mail');

const bodyRequired = ['listName', 'template'];
const bodyValidations = {
  'listName': ['required', 'string', mailUtils.checkValidMailName],
  'template': ['required', 'string', mailUtils.checkValidTemplateName]
};

function SendListRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

SendListRequest.prototype = Object.create(Request.prototype);
SendListRequest.prototype.constructor = SendListRequest;

module.exports = SendListRequest;
