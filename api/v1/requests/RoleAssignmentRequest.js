const roles = require('../utils/roles');
const Request = require('./Request');

const bodyRequired = ['id', 'role'];
const bodyValidations = {
  'id': [ 'required', 'integer' ],
  'role': ['required', 'string', roles.verifyRole]
};

function RoleAssignmentRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
}

RoleAssignmentRequest.prototype = Object.create(Request.prototype);
RoleAssignmentRequest.prototype.constructor = RoleAssignmentRequest;

module.exports = RoleAssignmentRequest;
