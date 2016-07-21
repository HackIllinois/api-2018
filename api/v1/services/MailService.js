/* jshint esversion: 6 */

// NOTE: successful requests are not logged, since all mail activity is logged
// by the client itself.
// NOTE: the sink is active during development! use whitelisted domains to avoid
// wasting messages on emails that lack a whitelisted domain (and other frustrations)

var promise = require('bluebird');
var SparkPost = require('sparkpost');
var _ = require('lodash');

var config = require('../../config');
var logger = require('../../logging');
var files = require('../../files');

var ExternalProviderError = require('../errors/ExternalProviderError');
var MailingList = require('../models/MailingList');

var client = new SparkPost(config.mail.key || 'NONE');
var transmissionsAsync = promise.promisifyAll(client.transmissions);
var recipientsAsync = promise.promisifyAll(client.recipientLists);
client.isEnabled = !!config.mail.key;

const CLIENT_NAME = 'SparkPost';
const CLIENT_DISABLED_REASON = "the client is disabled";
const RECIPIENTS_NOT_WHITELISTED_REASON = "none of the recipients are whitelisted";
const LIST_NOT_WHITELISTED_REASON = "this list cannot recieve development messages";
const LIST_EMPTY_REASON = "the recipient list was empty";
const LIST_SINGULAR_REASON = "the recipient list held only one recipient; sending" +
	" via regular transmission";

function handleOperationUnsuccessful(template, recipients, substitutions, reason, supressOutput) {
	logger.warn("%s tranmission '%s' not sent to %j because %s", CLIENT_NAME, template, recipients, reason);
	if (config.isDevelopment && !supressOutput) {
		logger.info("writing transmission details to temp folder");
		files.writeMail(recipients, template, substitutions);
	}
}

function _hasWhitelistedDomain(recipient) {
	recipient = recipient.toLowerCase();
	for (var i = 0; i < config.mail.whitelistedDomains.length; i++) {
		if (_.endsWith(recipient, config.mail.whitelistedDomains[i])) {
			return true;
		}
	}

	return false;
}

function _isWhitelistedList(list) {
	for (var i = 0; i < config.mail.whitelistedLists.length; i++) {
		if (list === config.mail.whitelistedLists[i]) {
			return true;
		}
	}

	return false;
}

function _formatRecipients (recipients, useWhitelist) {
	if (!_.isArray(recipients)) {
		recipients = [recipients];
	}

	return _.map(recipients, function (recipient) {
		if (useWhitelist && !_hasWhitelistedDomain(recipient)) {
			recipient += config.mail.sinkhole;
		}
		return { address: { email: recipient } };
	});
}

function _formatRecipientsList(list) {
	return MailingList.findByName(list)
		.then(function (mailingList) {
			return mailingList.members();
		})
		.then(function (memberCollection) {
			return memberCollection.map (function (member) {
				return { address: { email: member.attributes.email } };
			});
		});
}

function _handleClientError(error) {
	var responseError = error.errors[0];
	var message;
	if (_.has(responseError, 'description')) {
		message = responseError.description;
	} else {
		message = "the mailing client received an error";
	}
	message += " (" + responseError.message + ")";

	throw new ExternalProviderError(message, CLIENT_NAME);
}

/**
 * Sends a templated email to the requested recipients
 * @param  {String|Array} recipients	a list of the recipients
 * @param  {String} template			the template identifier to use
 * @param  {Object} substitutions		a mapping of keys to their substitution values (optional)
 * @return {Promise<>}					an empty promise
 * @throws {ExternalProviderError} 		when the mail client returns an error
 */
function send(recipients, template, substitutions) {
	var transmission = {
		content: { template_id: template },
		recipients: _formatRecipients(recipients, config.isDevelopment),
		substitution_data: (substitutions) ? substitutions : {}
	};

	if (_.isEmpty(transmission.recipients)) {
		handleOperationUnsuccessful(template, recipients, substitutions, RECIPIENTS_NOT_WHITELISTED_REASON);
		return promise.resolve(true);
	}

	return transmissionsAsync
		.sendAsync({ transmissionBody: transmission })
		.then(function (result) {
			// get rid of the transmission response
			return true;
		})
		.catch(_handleClientError);
}

/**
 * Sends a templated email to the requested email list
 * @param  {Object} list          	the (internal-client) list representation (see mail.js)
 * @param  {String} template      	the template identifier to use
 * @param  {Object} substitutions 	a mapping of keys to their substitution values (optional)
 * @return {Promise<>}				an empty promise
 * @throws {ExternalProviderError}	when the mail client returns an error
 */
function sendToList(list, template, substitutions) {
	if (config.isDevelopment && !_isWhitelistedList(list.name)) {
		handleOperationUnsuccessful(template, list.name, substitutions, LIST_NOT_WHITELISTED_REASON);
		return promise.resolve(true);
	}

	var recipientList = {
		id: list.id,
		recipients: [] // unknown until we gather the recipients from the datastore
	};
	var transmission = {
		content: { template_id: template },
		recipients: { list_id: list.id },
		substitution_data: (substitutions) ? substitutions : {}
	};

	return _formatRecipientsList(list.name)
		.then(function (recipients) {
			recipientList.recipients = recipients;
			if (recipients.length >= 1) {
				// we cannot update a list with any less than 1 member
				return recipientsAsync.updateAsync(recipientList);
			}

			return true;
		})
		.then(function () {
			if (recipientList.recipients.length === 0) {
				handleOperationUnsuccessful(template, list.name, substitutions, LIST_EMPTY_REASON);
				return true;
			}
			if (recipientList.recipients.length === 1) {
				handleOperationUnsuccessful(template, list.name, substitutions, LIST_SINGULAR_REASON, true);

				var recipient = recipientList.recipients[0].address.email;
				return send(recipient, template, substitutions);
			}
			return transmissionsAsync.sendAsync({ transmissionBody: transmission });
		})
		.then(function () {
			// get rid of the transmission response, if there is one
			return true;
		})
		.catch(_handleClientError);
}

/**
 * Adds a user to a mailing list. Does not check whether or not the user
 * is already on the desired list
 * @param {User} user						the user to add to the list
 * @param {Object} list						the internal list representation to receive this user
 * @returns {Promise<MailingListUser>}		an promise with the save result
 */
function addToList(user, list) {
	return MailingList
		.findByName(list.name)
		.then(function (mailingList) {
			return mailingList.addUser(user);
		});
}

/**
 * Removes a user from a mailing list
 * @param  {User} user					the user to remove from the list
 * @param  {Object} list				the internal list representation that the user is currently on
 * @return {Promise<MailingListUser>}	a promise with the deleted result
 */
function removeFromList(user, list) {
	return MailingList
		.findByName(list.name)
		.then(function (mailingList) {
			return mailingList.removeUser(user);
		});
}

function sendDisabled(recipients, template, substitutions) {
	handleOperationUnsuccessful(template, recipients, substitutions, CLIENT_DISABLED_REASON);
	return promise.resolve(true);
}

module.exports.clientName = CLIENT_NAME;
module.exports.addToList = addToList;
module.exports.removeFromList = removeFromList;
if (client.isEnabled) {
	module.exports.send = send;
	module.exports.sendToList = sendToList;
} else {
	module.exports.send = sendDisabled;
	module.exports.sendToList = sendDisabled;
}
