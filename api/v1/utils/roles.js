var _ = require('lodash');

var ALL_ROLES = ['ADMIN', 'STAFF', 'SPONSOR', 'MENTOR', 'VOLUNTEER', 'HACKER'];

_.forEach(ALL_ROLES, function (role) {
	_.assign(module.exports, role);
});

module.exports.ALL = ALL_ROLES;
module.exports.ORGANIZERS = ['ADMIN', 'STAFF'];
