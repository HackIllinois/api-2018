var mail = require('../utils/mail');

var Model = require('./Model');
var MailingListEntry = Model.extend({
	tableName: 'mailing_list_entries',
	idAttribute: 'id',
	validations: { }
});

module.exports = MailingListEntry;
