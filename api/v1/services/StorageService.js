/* jshint esversion: 6 */

var config = require('../../config');
var files = require('../../files');
var errors = require('../errors');
var logger = require('../logging');
var Upload = require('../models/Upload');

var client = require('aws-sdk');
var _Promise = require('bluebird');
var type = require('file-type');
var _ = require('lodash');

client.config.credentials = new client.SharedIniFileCredentials({ profile: config.profile });
client.isEnabled = !!client.config.accessKeyId;

const INVALID_LENGTH_MESSAGE = "The uploaded content was larger than the maximum allowed length";
const INVALID_CONTENT_DISPOSITION = "The uploaded content did not match any of the allowed types";

function _makeUploadKey(owner) {
	return owner.attributes.id + '/' + time.unix();
}

function _confirmLength(content, maxLength) {
	var message;
	if (!maxLength && content.length > config.storage.maxLength) {
		message = INVALID_LENGTH_MESSAGE + " (" + config.storage.maxLength + " bytes)";
		throw new errors.InvalidUploadError(message);
	}
	else if (content.length > maxLength) {
		message = INVALID_LENGTH_MESSAGE + " (" + maxLength + " bytes)";
		throw new errors.InvalidUploadError(message);
	}

	return content.length;
}

function _confirmDisposition(content, dispositions) {
	var disposition = type(content);
	disposition = (disposition) ? disposition : { };
	disposition.ext = (disposition.ext) ? disposition.ext.toUpperCase() : 'UNKNOWN'; // TODO use util version here

	if (!!dispositions && !_.isEmpty(dispositions)) {
		dispositions = _.map(dispositions, d => d.toUpperCase());
		if (!_.includes(dispositions, disposition.ext)) {
			var message = INVALID_CONTENT_DISPOSITION + " (" + dispositions.join(', ') + ")";
			throw new errors.InvalidUploadError(message);
		}
	}

	return disposition.ext;
}

function _confirmUploadable(upload) {
	if (upload.attributes.status !== 'EMPTY') { // TODO use util version here
		var message = "The reserved upload with ID " + upload.attributes.id + " already has content";
		throw new errors.InvalidUploadError(message);
	}

	return true;
}

/**
 * Reserves a new upload for the owner
 * @param  {User} owner				the owner of the content
 * @param  {String} name			the name of the incoming stream
 * @param  {String} bucket			the bucket in which to store the content
 * @return {Promise<Upload>}		a promise resolving to the internal upload representation
 */
function reserve(owner, name, bucket) {
	var uploadParams = {};
	uploadParams.owner_id = owner.attributes.id;
	uploadParams.key = _makeUploadKey(owner);
	uploadParams.bucket = bucket;
	uploadParams.name = name;

	var upload = Upload.forge(uploadParams);
	return upload.save();
}

/**
 * Uploads a reserved upload to storage
 * @param  {Upload} upload			the previously-reserved upload for this content
 * @param  {Buffer} content			the content to be stored
 * @param  {Number} maxLength		(optional) the max length of the buffer, defaulting to the configured max
 * @param  {Array} dispositions		(optional) a list of allowed file types, defaulting to any
 * @return {Promise<Upload>}		a promise resolving to the internal upload representation
 * @throws {InvalidUploadError}		when the upload fails any imposed validations
 */
function upload(upload, content, maxLength, dispositions) {
	return new _Promise(function (resolve, reject) {
		var length = _confirmLength(content, maxLength);
		var disposition = _confirmDisposition(content, dispositions);
		_confirmUploadable(upload);

		upload.attributes.disposition = disposition;
		upload.attributes.status = 'SENT'; // TODO use util version here

		return upload.save();
	}).then(function (upload) {
		files
			.writeStream(content, upload.attributes.key)
			.then(function () {
				upload.attributes.status = 'STORED'; // TODO use util version here
				return upload.save();
			}).catch(function (error) {
				var key = upload.attrbiutes.key;
				var bucket = upload.attrbiutes.bucket;

				logger.error("upload failed for reservation with key %s in %s: \n%j", key, bucket, error.stack);

				upload.attributes.status = 'DROPPED'; // TODO use util version here
				return upload.save();
			});

		return upload;
	});
}

/**
 * Retrieves a file stream from storage
 * @param  {Upload} upload			an internal upload representation
 * @return {Promise<Buffer>}		a promise resolving to the file
 * @throws {ExternalProviderError}	when the client throws an error
 */
function get(upload) {

}

/**
 * Removes a file stream from storage
 * @param {Upload} upload 			an internal upload representation
 * @return {Promise<>}				an empty promise indicating success
 * @throws {ExternalProviderError}	when the client throws an error
 */
function remove(upload) {

}
