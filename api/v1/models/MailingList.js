var Model = require('./Model');
var User = require('./User');
var MailingListUser = require('./MailingListUser');

var MailingList = Model.extend({
	tableName: 'mailing_lists',
	idAttribute: 'id'
});

/**
 * Finds a list by its name
 * @param  {String} name			a list's name
 * @return {Promise<MailingList>} 	the desired mailing list, or null
 */
MailingList.findByName = function (name) {
	return this.collection().query({ where: { name: name } }).fetchOne();
};

/**
 * Determines the members of this list
 * @return {Promise<Collection>} the Users that are on this list
 */
MailingList.prototype.members = function (list) {
	return this.belongsToMany(User).through(MailingListUser).fetch();
};

module.exports = MailingList;
