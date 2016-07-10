var Promise = require('bluebird');
var SparkPost = require('sparkpost');
var _ = require('lodash');

var config = require('../../config');
var logger = require('../../logging');

var client = Promise.promisifyAll(new SparkPost(config.mail.key));
client.isEnabled = !!config.mail.key;

function _isWhitelisted(recipient) {
	recipient = recipient.toLowerCase();
	for (var i = 0; i < config.mail.whitelist.length; i++) {
		if (_.endsWith(recipient, config.mail.whitelist[i])) {
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
		if (useWhitelist && !_isWhitelisted(recipient)) {
			recipient += config.mail.sinkhole;
		}
		return { address: recipient };
	});
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
 * @return {Promise}					a Promise resolving to true
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

function addToList(recipient, list) {
	// TODO create mailing list table 
}

function sendDisabled(recipients, template, substitutions) {
	logger.info("mail transmission with template '%s' requested to %j but client" +
		" is disabled. substitutions were %j", template, recipients, substitutions);

	return Promise.resolve(true);
}

if (client.isEnabled) {
	module.exports.send = send;
} else {
	module.exports.send = sendDisabled;
}
