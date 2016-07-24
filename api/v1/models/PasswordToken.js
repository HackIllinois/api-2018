var Model = require('./Model');
var User = require('./User');

var PasswordToken = Model.extend({
	tableName: 'password_tokens',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated']
});


module.exports = PasswordToken;