var _ = require('lodash');

var Model = require('./Model');
var UserRole = Model.extend({
	tableName: 'user_roles',
	idAttribute: 'id'
});

UserRole.prototype.toJSON = function () {
	return _.omit(this.attributes, 'userId');
};

module.exports = UserRole;
