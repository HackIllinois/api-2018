const Model = require('./Model');
const MailingListUser = Model.extend({
	tableName: 'mailing_lists_users',
	idAttribute: 'id'
});

module.exports = MailingListUser;
