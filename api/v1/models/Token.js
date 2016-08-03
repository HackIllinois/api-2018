var Promise = require('bluebird');

var Model = require('./Model');
var User = require('./User');
var Crypto = require('../utils/crypto');

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
 * @param {String|Number} value The Token's value
 * @return {Promise} resolving to the associated Token Model
 * @throws {NotFoundError} when the requested token cannot be found
 */
Token.findByValue = function(value) {
	return this.collection().query({ where: { value: value }}).fetchOne();
};

/**
 * Obtains the user model this token refers to
 * @return {Promise} resolving to the associated User model
 */
Token.prototype.getUser = function () {
	var id = this.get('userId');
	return User.findById(id);
};

module.exports = Token;
