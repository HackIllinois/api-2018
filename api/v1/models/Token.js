var Model = require('./Model');
var User = require('./User');

var Token = Model.extend({
	tableName: 'tokens',
	idAttribute: 'id',
	hasTimestamps: ['created'],
	user: function(){
		return this.belongsTo(User, 'user_id');
	},
	validations: {
		value: ['required', 'string']
	}
});

/**
 * Finds a token given the Token value
 * @param {String} value The Token's value
 * @return {Promise} resolving to the associated Token Model
 */
Token.findByValue = function(value) {
	return this.collection().query({ where: { value: value }}).fetchOne({ withRelated: ['user'] } );
};

module.exports = Token;
