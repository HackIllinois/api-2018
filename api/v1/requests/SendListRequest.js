const Request = require('./Request');
const mail = require('../utils/mail');
const _ = require('lodash');

const bodyRequired = ['listName', 'template'];
const bodyValidations = {
	'listName':  ['required', 'string', checkValidMailName],
	'template': ['required', 'string', checkValidTemplateName]
};

function SendListRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

function checkValidMailName (listName) {
	return !_.isUndefined(mail.lists[listName]);
}

function checkValidTemplateName (templateName) {
	return !_.isUndefined(mail.templates[templateName]);
}

SendListRequest.prototype = Object.create(Request.prototype);
SendListRequest.prototype.constructor = SendListRequest;

module.exports = SendListRequest;
