var Model = require('./Model');
var User = require('./User');

var Token = Model.extend({
	tableName: 'tokens',
	idAttribute: 'id',
	hasTimestamps: ['created'],
	user: function(){
		return this.belongsTo(User, 'user_id');
	}
});

Token.findByEmail = function(email){
	email = email.toLowerCase();
	return this.collection().query({ where: { email: email } }).fetch();
}

module.exports = Token;