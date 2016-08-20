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
const DIRECTORY_SEPARATOR = '/';
const TEMP_DIRECTORY = './temp/';
const MAIL_DIRECTORY = TEMP_DIRECTORY + 'mail/';
const STORAGE_DIRECTORY = TEMP_DIRECTORY + 'storage/';

const META_EXTENSION = '.meta';
const META_SEPARATOR = '^|';

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
 * Writes a file to the temp directory. When called in non-development environments,
 * this method does nothing
 * @param {Buffer} content		the content to write
 * @param {Object} params		a parameter object with
 *                         		{String} key	the key under which to store the file
 *                         		{String} bucket	the bucket in which to store the file
 *                         		{String} type	the MIME type of the file
 * @return {Promise<>}			a resolved promise
 */
module.exports.writeFile = function (content, params) {
	if (!config.isDevelopment) {
		return _Promise.resolve(null);
	}

	var filePath = STORAGE_DIRECTORY + params.bucket + DIRECTORY_SEPARATOR + params.key;
	var metaFilePath = filePath + META_EXTENSION;

	// we only store the type for now, but adding to this array
	// would allow us to store more
	var metaContent = [params.type].join(META_SEPARATOR);

	mkdirp.sync(STORAGE_DIRECTORY + params.bucket);
	return _Promise.join(
		fs.writeFileAsync(filePath, content),
		fs.writeFileAsync(metaFilePath, new Buffer(metaContent)),
		function (fileResult, metaResult) {
			return _Promise.resolve(null);
		});
};

/**
 * Retrieves a file from the temp directory. When called in non-development environments,
 * this method does nothing
 * @param  {String} key			the key by which the content was stored
 * @param  {String} bucket		the bucket in which the key was stored
 * @return {Promise<Object>}	the stored file with
 *                              {Buffer} content the file content
 *                              {type} type the MIME type of the original file
 */
module.exports.getFile = function (key, bucket) {
	if (!config.isDevelopment) {
		return _Promise.resolve(null);
	}

	var filePath = STORAGE_DIRECTORY + bucket + DIRECTORY_SEPARATOR + key;
	var metaFilePath = filePath + META_EXTENSION;

	return _Promise.join(
		fs.readFileAsync(filePath),
		fs.readFileAsync(metaFilePath),
		function (file, meta) {
			meta = meta.toString();
			meta = meta.split(META_SEPARATOR);

			var result = {};
			result.content = file;
			result.type = meta[0];

			return _Promise.resolve(result);
		});
};

/**
 * Removes a file from the temp directory. When called in non-development environments,
 * this method does nothing
 * @param  {String} key		the key by which the content was stored
 * @return {Promise<>}		a resolved promise
 */
module.exports.removeFile = function (key) {
	if (!config.isDevelopment) {
		return _Promise.resolve(null);
	}

	var filePath = STORAGE_DIRECTORY + bucket + DIRECTORY_SEPARATOR + key;
	var metaFilePath = filePath + META_EXTENSION;

	return _Promise.join(
		fs.unlinkAsync(filePath),
		fs.unlinkAsync(metaFilePath),
		function (fileResult, metaResult) {
			return _Promise.resolve(null);
		});
};
