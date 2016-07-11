var Promise = require('bluebird');
var SparkPost = require('sparkpost');
var _ = require('lodash');

var config = require('../../config');
var logger = require('../../logging');
var MailingListEntry = require('../models/MailingListEntry');

var client = Promise.promisifyAll(new SparkPost(config.mail.key));
client.isEnabled = !!config.mail.key;

const CLIENT_DISABLED_REASON = "the client is disabled";
const LIST_NOT_WHITELISTED_REASON = "this list cannot recieve development messages";

function logDisabled(template, recipients, substitutions, reason) {
	logger.info("mail transmission with template '%s' requested to %j with substitutations %j but %s.",
		 template, recipients, substitutions, reason);
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

	return _.map(function (recipient) {
		if (useWhitelist && !_hasWhitelistedDomain(recipient)) {
			recipient += config.mail.sinkhole;
		}
		return { address: recipient };
	});
}

function _formatRecipientsList(list) {
	// TODO select email of all users in given list
	// TODO format into recipient object
}

function _handleClientError(errorResponse) {
	var error = errorResponse.errors[0];
	var message = "The mail client returned an error: " +
		error.message + " (" + error.description + ")";

	throw new errors.ExternalProviderError(message);
}

/**
 * Sends a templated email to the requested recipients
 * @param  {String|Array} recipients	a list of the recipients
 * @param  {String} template			the id of the template to use
 * @param  {Object} substitutions		a mapping of keys to their substitution values (optional)
 * @return {Promise}					an empty promise
 * @throws {ExternalProviderError} 		when the mail client returns an error
 */
function send(recipients, template, substitutions) {
	var transmission = {
		content: { template_id: template },
		recipients: _formatRecipients(recipients, config.isDevelopment),
		substitution_data: (substitutions) ? substitutions : {}
	};

	return client.transmissions
		.sendAsync(transmission)
		.then(function (result) {
			return true;
		})
		.catch(_handleClientError);
}

function sendToList(list, template, substitutions) {
	if (config.isDevelopment && !_isWhitelistedList(list)) {
		logDisabled(template, list, substitutions, LIST_NOT_WHITELISTED_REASON);
		return Promise.resolve(true);
	}

	var recipientList = {
		id: list,
		recipients: _formatListRecipients(list)
	};
	var transmission = {
		content: { template_id: template },
		recipients: { list_id: list },
		substitution_data: (substitutions) ? substitutions : {}
	};
	client.recipientLists
		.updateAsync(recipientList)
		.then(function (result) {
			return client.transmissions.sendAsync(transmission);
		})
		.then(function (result) {
			return true;
		})
		.catch(_handleClientError);	
}

/**
 * Adds a user to a mailing list. Does not check whether or not the user
 * is already on the desired list
 * @param {User} user		the user to add to the list
 * @param {String} list		the list to receive this user
 * @returns {Promise}		an empty promise
 */
function addToList(user, list) {
	var listEntry = MailingListEntry.forge({ user_id: user.id, list: list });
	return listEntry.save();
}

/**
 * Removes a user from a mailing list
 * @param  {User} user		the user to remove from the list
 * @param  {String} list	the list that the user is currently on
 * @return {Promise}		an empty promise
 */
function removeFromList(user, list) {
	return MailingListEntry.where('user_id', user.id).where('list', list).del();
}

function sendDisabled(recipients, template, substitutions) {
	logDisabled(template, recipients, substitutions, CLIENT_DISABLED_REASON);
	return Promise.resolve(true);
}

module.exports.addToList = addToList;
module.exports.removeFromList = removeFromList;
if (client.isEnabled) {
	module.exports.send = send;
	module.exports.sendToList = sendToList;
} else {
	module.exports.send = sendDisabled;
	module.exports.sendToList = sendDisabled;
}
