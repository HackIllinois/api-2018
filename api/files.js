/* jshint esversion: 6 */

var promise = require('bluebird');
var fs = promise.promisifyAll(require('fs'), {
	filter: function(n, f, t, d) { return d && !n.includes('Sync'); }
});
var mkdirp = require('mkdirp');
var _ = require('lodash');

var config = require('./config');
var logger = require('./logging');

// NOTE all paths are relative to the root of the project directory
const TEMP_DIRECTORY = './temp/';
const MAIL_DIRECTORY = TEMP_DIRECTORY + 'mail/';

/**
 * Writes a new mail entry to the temp directory. When called in non-development
 * environments, this method does nothing
 * @param  {Array|String} 	recipients    the intended recipients
 * @param  {String} 		template      the intended template
 * @param  {Object} 		substitutions the intended substitutions (if any)
 * @return {Promise<>}		a resolved promise
 */
module.exports.writeMail = function (recipients, template, substitutions) {
	if (!config.isDevelopment) {
		// we will never write directly to the filesystem running our
		// instance on production, so do nothing
		return promise.resolve(null);
	}

	var fileName = template + "-" + Math.floor(new Date() / 1000) + ".txt";
	var filePath = MAIL_DIRECTORY + fileName;

	var fileContent = "A transmission was prepared for ";
	fileContent += (_.isArray(recipients)) ? _.join(recipients, ', ') : recipients;
	fileContent += ". The requested template was \'" + template + "\'.\n\n";

	if (_.isUndefined(substitutions) || _.isEmpty(substitutions)) {
		fileContent += "There were no substitutions provided for injection.";
	} else {
		fileContent += "The following substitutions were provided for injection: \n";
		_.forOwn(substitutions, function (value, key) {
			fileContent += key + ": " + value + "\n";
		});
	}

	// the target directory is created here (if it doesn't already exist)
	// to ensure we don't have any temp directories written in production
	mkdirp.sync(MAIL_DIRECTORY);
	return fs.writeFileAsync(filePath, fileContent);
};
