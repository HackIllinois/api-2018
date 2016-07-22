var promise = require('bluebird');

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
 * Adds a user to this list, if it is not already present
 * @param {User}	user				the user to add
 * @returns {Promise<MailingListUser>}	an promise with the save result
 */
MailingList.prototype.addUser = function (user) {
	var mailingListUser = MailingListUser.forge({ user_id: user.id, mailing_list_id: this.attributes.id });
	return MailingListUser
		.transaction(function (t) {
			return mailingListUser
				.fetch({ transacting: t })
				.then(function (result) {
					if (result) {
						return promise.resolve(result);
					}
					return mailingListUser.save(null, { transacting: t });
				});
		});
};

/**
 * Removes a user from this list, if it is present
 * @param  {User} user					the user to remove from the list
 * @return {Promise<MailingListUser>}	a promise with the deleted result
 */
MailingList.prototype.removeUser = function (user) {
	return MailingListUser
		.where({ user_id: user.id, mailing_list_id: this.attributes.id })
		.destroy();
};

/**
 * Determines the members of this list
 * @return {Promise<Collection>} the Users that are on this list
 */
MailingList.prototype.members = function (list) {
	return this.belongsToMany(User).through(MailingListUser).fetch();
};

module.exports = MailingList;
