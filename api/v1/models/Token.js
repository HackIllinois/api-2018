var Model = require('./Model');
var User = require('./User');

var Token = Model.extend({
	tableName: 'tokens',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'userId']
	}
});

module.exports = Token;
