/* jshint esversion: 6 */

var config = require('../../config');
var files = require('../../files');
var errors = require('../errors');
var Upload = require('../models/Upload');

var uuid = require('node-uuid');
var _Promise = require('bluebird');
var _ = require('lodash');

var client = require('aws-sdk');
client.config.credentials = new client.SharedIniFileCredentials({ profile: config.profile });
client.isEnabled = !!client.config.credentials.accessKeyId;

var remote = new client.S3();

const CLIENT_NAME = "AWS_S3";

function _handleDisabledUpload (upload, file) {
	if (!config.isDevelopment) {
		// something went wrong and we made it into production without
		// an enabled client, so do not expose the instance's file system
		throw new errors.ApiError();
	}

	var params = {};
	params.bucket = upload.get('bucket');
	params.key = upload.get('key');
	params.type = file.type;

	return files.writeFile(file.content, params);
}

function _handleUpload (upload, file) {
	var params = {};
	params.Body = file.content;
	params.Bucket = upload.get('bucket');
	params.Key = upload.get('key');
	params.ContentLength = file.content.length;
	params.ContentType = file.type;

	return remote.putObject(params).promise()
		.catch(function (error) {
			var message = "the storage client received an error on upload";
			message += " (" + error.message + ")";

			throw new errors.ExternalProviderError(message, CLIENT_NAME);
		});
}

function _handleDisabledRetrieval (upload) {
	return files.getFile(upload.get('key'), upload.get('bucket'))
		.then(function (file) {
			var result = {};
			result.content = file.content;
			result.type = file.type;

			return _Promise.resolve(result);
		});
}

function _handleRetrieval (upload) {
	var params = {};
	params.Bucket = upload.get('bucket');
	params.Key = upload.get('key');

	return remote.getObject(params).promise()
		.then(function (data) {
			var result = {};
			result.content = data.Body;
			result.type = data.ContentType;

			return result;
		})
		.catch(function (error) {
			var message = "the storage client received an error on retrieval";
			message += " (" + error.message + ")";

			throw new errors.ExternalProviderError(message, CLIENT_NAME);
		});
}

function _handleDisabledRemoval (upload) {
	return files
		.removeFile(upload.get('key'))
		.then(function () {
			return upload.destroy();
		});
}

function _handleRemoval (upload) {
	var params = {};
	params.Bucket = upload.get('bucket');
	params.Key = upload.get('key');

	return remote.deleteObject(params).promise()
		.catch(function (error) {
			var message = "the storage client received an error on removal";
			message += " (" + error.message + ")";

			throw new errors.ExternalProviderError(message, CLIENT_NAME);
		})
		.then(function () {
			return upload.destory();
		});
}

/**
 * Finds an upload by its internal ID
 * @param  {Number} id			the internal ID of the requested upload
 * @return {Promise<Upload>}	the requested upload
 * @throws {NotFoundError}	when the upload does not exist
 */
module.exports.findUploadById = function (id) {
	return Upload
		.findById(id)
		.then(function (result) {
			if (_.isNull(result)) {
				var message = "An upload with the given ID cannot be found";
				var source = 'id';
				throw new errors.NotFoundError(message, source);
			}

			return _Promise.resolve(result);
		});
};

/**
 * Finds an upload by its key in a given bucket
 * @param  {String} key		the previously key given to the upload
 * @param  {String} bucket	the bucket assigned to the upload
 * @return {Promise<Upload>} the requested upload
 * @throws {NotFoundError} when the upload does not exist
 */
module.exports.findUploadByKey = function (key, bucket) {
	return Upload
		.findByKey(key, bucket)
		.then(function (result) {
			if (_.isNull(result)) {
				var message = "An upload with the given key does not exist in the provided bucket";
				var source = ['key', 'bucket'];
				throw new errors.NotFoundError(message);
			}

			return _Promise.resolve(result);
		});
};

/**
 * Creates an internal upload representation
 *
 * @param  {User} owner				the owner of the upload
 * @param  {Object} params			parameter object with
 *                           		{String} bucket			the target upload bucket
 *                           		{String} key			(optional) the 36-character key to use for the upload
 * @return {Promise<Upload>}		a promise resolving to the new upload
 *
 */
module.exports.createUpload = function (owner, params) {
	var uploadParams = {};
	uploadParams.ownerId = owner.get('id');
	uploadParams.key = params.key || uuid.v4();
	uploadParams.bucket = params.bucket;

	return Upload.forge(uploadParams).save();
};

/**
 * Provides a signed, short-term upload URI
 * @param  {Upload} upload			the internal upload representation associated with this upload
 * @param  {Object} file			parameter object with
 *                         			{String} content	the Buffer containing the file
 *                         			{String} type		the MIME type of the upload
 * @return {Promise<String>} an upload to which the file will be accepted
 * @throws {ExternalProviderError}	when the upload fails any imposed validations
 */
module.exports.persistUpload = function (upload, file) {
	if (!client.isEnabled) {
		return _handleDisabledUpload(upload, file);
	}
	return _handleUpload(upload, file);
};

/**
 * Retrieves an upload from remote storage
 * @param  {Upload} upload			an internal upload representation
 * @return {Promise<Object>}		an object with
 *                               	{Buffer} content 		the content retrieved
 *                               	{String} type			the MIME type of the content
 * @throws {ExternalProviderError}	when the client throws an error
 */
module.exports.getUpload = function (upload) {
	if (!client.isEnabled) {
		return _handleDisabledRetrieval(upload);
	}
	return _handleRetrieval(upload);
};

/**
 * Removes a file from storage
 *
 * @param {Upload} upload 			an internal upload representation
 * @param {Transaction} transaction	(optional) a pending database transaction
 * @return {Promise<>}				an empty promise indicating success
 * @throws {ExternalProviderError}	when the client throws an error
 */
module.exports.removeUpload = function (upload) {
	if (!client.isEnabled) {
		return _handleDisabledRemoval(upload);
	}
	return _handleRemoval(upload);
};
