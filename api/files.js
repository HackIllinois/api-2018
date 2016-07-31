/* jshint esversion: 6 */

var _Promise = require('bluebird');
var fs = _Promise.promisifyAll(require('fs'), {
	filter: function(n, f, t, d) { return d && !n.includes('Sync'); }
});
var mkdirp = require('mkdirp');
var _ = require('lodash');

var config = require('./config');
var logger = require('./logging');
var time = require('./v1/utils/time');

// NOTE all paths are relative to the root of the project directory
const TEMP_DIRECTORY = './temp/';
const MAIL_DIRECTORY = TEMP_DIRECTORY + 'mail/';
const STORAGE_DIRECTORY = TEMP_DIRECTORY + 'storage/';

const DEFAULT_STORAGE_EXTENSION = 'bin';

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
		return _Promise.resolve(null);
	}

	var fileName = template + "-" + time.unix() + ".txt";
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

/**
 * Writes a Buffer to the temp directory. When called in non-development environments,
 * this method does nothing
 * @param {Buffer} content		the content to write
 * @param {String} key			the key by which the content will be retrieved
 * @return {Promise<>}			a resolved promise
 */
module.exports.writeStream = function (content, key) {
	if (!config.isDevelopment) {
		return _Promise.resolve(null);
	}

	var filePath = STORAGE_DIRECTORY + key;

	mkdirp.sync(STORAGE_DIRECTORY);
	return fs.writeFileAsync(filePath, content);
};

/**
 * Retrieves a Buffer from the temp directory. When called in non-development environments,
 * this method does nothing
 * @param  {String} key			the key by which the content was stored
 * @return {Promise<Buffer>}	a promise resolving to a raw buffer
 */
module.exports.getStream = function (key) {
	if (!config.isDevelopment) {
		return _Promise.resolve(null);
	}

	var filePath = STORAGE_DIRECTORY + key;
	return fs.readFileAsync(filePath);
};

/**
 * Removes a Buffer from the temp directory. When called in non-development environments,
 * this method does nothing
 * @param  {String} key		the key by which the content was stored
 * @return {Promise<>}		a resolved promise
 */
module.exports.removeStream = function (key) {
	if (!config.isDevelopment) {
		return _Promise.resolve(null);
	}

	var filePath = STORAGE_DIRECTORY + key;
	return fs.unlinkAsync(filePath);
};
