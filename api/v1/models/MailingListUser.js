var Model = require('./Model');
var MailingListUser = Model.extend({
	tableName: 'mailing_lists_users',
	idAttribute: 'id',
	validations: { }
});

module.exports = MailingListUser;
