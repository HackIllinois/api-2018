const _ = require('lodash');

const ALL_ROLES = ['ADMIN', 'STAFF', 'SPONSOR', 'MENTOR', 'VOLUNTEER', 'ATTENDEE'];

_.forEach(ALL_ROLES, (role) => {
  module.exports[role] = role;
});

module.exports.NONE = [];
module.exports.ALL = ALL_ROLES;
module.exports.SUPERUSER = ALL_ROLES[0];
module.exports.ORGANIZERS = ['ADMIN', 'STAFF'];
module.exports.PROFESSIONALS = ['SPONSOR', 'MENTOR'];
module.exports.NON_PROFESSIONALS = ['ADMIN', 'STAFF', 'VOLUNTEER', 'ATTENDEE'];
module.exports.HOSTS = ['ADMIN', 'STAFF', 'VOLUNTEER'];
module.exports.COMMON = ['SPONSOR', 'MENTOR', 'VOLUNTEER', 'ATTENDEE'];

/**
 * Determines whether or not a given role is in a certain role group
 * @param  {Array}  group  a group of roles
 * @param  {String}  role  a role to verify
 * @return {Boolean}       whether or not role is in the given group
 */
module.exports.isIn = (group, role) => _.includes(group, role);

/**
 * Ensures that the provided role is in ALL_ROLES
 * @param  {String} role the value to check
 * @return {Boolean} true when the role is valid
 * @throws TypeError when the role is invalid
 */
module.exports.verifyRole = (role) => {
  if (!module.exports.isIn(ALL_ROLES, role)) {
    throw new TypeError(role + ' is not a valid role');
  }

  return true;
};
