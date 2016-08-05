/* jshint esversion: 6 */

var config = require('../../config');
var files = require('../../files');
var errors = require('../errors');
var logger = require('../logging');
var storageUtils = require('../utils/storage');
var Upload = require('../models/Upload');

var client = require('aws-sdk');
var _Promise = require('bluebird');
var _ = require('lodash');

client.config.credentials = new client.SharedIniFileCredentials({ profile: config.profile });
client.isEnabled = !!client.config.accessKeyId;

const INVALID_LENGTH_MESSAGE = "The upload was larger than the maximum allowed length";
const INVALID_CONTENT_TYPE = "The upload did not match any of the allowed types";
const NOT_READY = "The requested content has not yet been persisted or failed to be persisted";
const FAILURE_TEMPLATE = "upload failed for file with key %s in %s: \n%j";
const UPLOAD_KEY_SEPARATOR = '/';

const DEVELOPMENT_UPLOAD_URI = '/api/v1/upload/dev?id=';

function _makeUploadKey(owner) {
	return owner.get('id') + UPLOAD_KEY_SEPARATOR + time.unix();
}

function _confirmMimetype(type, allowedTypes) {
	if (!!allowedTypes && !_.isEmpty(allowedTypes)) {
		if (!_.includes(allowedTypes, type)) {
			var message = INVALID_CONTENT_TYPE + " (" + allowedTypes.join(', ') + ")";
			throw new errors.InvalidUploadError(message);
		}
	}
}

function _confirmLength(length, maxLength) {
	var message;
	if (!maxLength && content.length > config.storage.maxLength) {
		message = INVALID_LENGTH_MESSAGE + " (" + config.storage.maxLength + " bytes)";
		throw new errors.InvalidUploadError(message);
	}
	else if (content.length > maxLength) {
		message = INVALID_LENGTH_MESSAGE + " (" + maxLength + " bytes)";
		throw new errors.InvalidUploadError(message);
	}
}

/**
 * Finds an upload by its internal ID
 * @param  {Number} id		the internal ID of the requested upload
 * @return {Upload} 		the requested upload
 * @throws {NotFoundError}	when the upload does not exist
 */
module.exports.findUploadById = function (id) {
	return Upload
		.findById(id)
		.then(function (result) {
			if (_.isNull(result)) {
				var message = "An upload with the given ID cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}

			return Promise.resolve(result);
		});
};

/**
 * Creates an internal upload representation and provides a signed upload URL
 *
 * @param  {Object} file			parameter object with
 *                         			{String} type		the MIME type of the upload
 *                            		{Integer} length	the expected length of the upload
 *                              	{String} name		the name of the upload
 * @param  {User} owner				the owner of the upload
 * @param  {String} bucket			the target upload bucket
 * @param  {Object} params			(optional) parameter object with
 *                           		{Array} allowedTypes	(optional) a list of allowed MIME types
 *                           		{Number} maxLength		(optional) the max length of the upload in bytes
 * @return {Promise<Object>}		a promise resolving to an object with
 *                              	{Upload} upload 	the internal upload record
 *                               	{String} url		the short-expiration signed upload URL
 * @throws {InvalidUploadError}		when the upload fails any imposed validations
 * @throws {ExternalProviderError}	when the client throws an error
 */
module.exports.create = function (file, owner, bucket, params) {
	return new _Promise(function (resolve, reject) {
		_confirmMimetype(file.type, (params) ? params.allowedTypes : undefined);
		_confirmLength(file.length, (params) ? params.maxLength : undefined);

		var uploadParams = {};
		uploadParams.owner_id = owner.get('id');
		uploadParams.key = _makeUploadKey(owner);
		uploadParams.bucket = params.bucket;
		uploadParams.status = storageUtils.statuses.sent;

		return Upload.forge(uploadParams).save();
	}).then(function (upload) {
		var result = { upload: upload };

		// TODO make helper methods here
		if (!client.isEnabled) {
			if (!config.isDevelopment) {
				// something went wrong and we made it into production without
				// an enabled client
				return upload
					.destroy()
					.then(function () {
						throw new Errors.ApiError();
					});
			}

			result.url = config.domain + DEVELOPMENT_UPLOAD_URI + upload.get('id');
			return _Promise.resolve(result);
		} else {
			// TODO add aws support
			logger.error("AWS support not implemented!");

			result.url = '';
			return _Promise.resolve(result);
		}
	});
};

/**
 * Provides a signed URL for retrieving a an upload
 * @param  {Upload} upload			an internal upload representation
 * @return {Promise<String>}
 * @throws {ExternalProviderError}	when the client throws an error
 */
module.exports.get = function (upload) {
	return new _Promise(function (resolve, reject) {
		// TODO add aws support and remove wrapping promise
		return files.getFile(upload.get('key'));
	});
};

/**
 * Removes a file from storage
 *
 * @param {Upload} upload 			an internal upload representation
 * @param {Transaction} transaction	(optional) a pending database transaction
 * @return {Promise<>}				an empty promise indicating success
 * @throws {ExternalProviderError}	when the client throws an error
 */
module.exports.remove = function (upload, transaction) {
	return files
		.removeStream(upload.get('key'))
		.then(function () {
			if (transaction) {
				return upload.destroy({ transacting: transaction });
			}
			return upload.destroy();
		});
};

/**
 * Removes all requested files from storage
 *
 * @param  {Array<Upload>} uploads 	the uploads to delete
 * @return {Promise<>}				an empty promise indicating success
 * @throws {ExternalProviderError}	when the client throws an error
 */
module.exports.removeAll = function (uploads) {
	return Upload.transaction(function (t) {
		var removed = [];
		uploads.forEach(function (upload) {
			removed.push(module.exports.remove(upload, t));
		});

		return _Promise.all(removed);
	});
};
