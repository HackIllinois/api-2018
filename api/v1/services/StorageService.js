/* jshint esversion: 6 */
const client = require('aws-sdk');

const files = require('../../files');
const errors = require('../errors');
const Upload = require('../models/Upload');

const uuid4 = require('uuid/v4');
const _Promise = require('bluebird');
const _ = require('lodash');
const CLIENT_NAME = 'AWS_S3';

function StorageService(ctx) {
  let config = ctx.config();

  client.config.update(config.aws.defaults);
  let remote = new client.S3();

  function _handleDisabledUpload(upload, file) {
    if (!config.isDevelopment) {
      // something went wrong and we made it into production without
      // an enabled client, so do not expose the instance's file system
      throw new errors.ApiError();
    }

    const params = {};
    params.bucket = upload.get('bucket');
    params.key = upload.get('key');
    params.type = file.type;

    return files.writeFile(file.content, params);
  }

  function _handleUpload(upload, file) {
    const params = {};
    params.Body = file.content;
    params.Bucket = upload.get('bucket');
    params.Key = upload.get('key');
    params.ContentLength = file.content.length;
    params.ContentType = file.type;

    return remote.putObject(params)
      .promise()
      .catch((error) => {
        let message = 'the storage client received an error on upload';
        message += ' (' + error.message + ')';

        throw new errors.ExternalProviderError(message, CLIENT_NAME);
      });
  }

  function _handleDisabledRetrieval(upload) {
    return files.getFile(upload.get('key'), upload.get('bucket'))
      .then((file) => {
        const result = {};
        result.content = file.content;
        result.type = file.type;

        return _Promise.resolve(result);
      });
  }

  function _handleRetrieval(upload) {
    const params = {};
    params.Bucket = upload.get('bucket');
    params.Key = upload.get('key');

    return remote.getObject(params)
      .promise()
      .then((data) => {
        const result = {};
        result.content = data.Body;
        result.type = data.ContentType;

        return result;
      })
      .catch((error) => {
        let message = 'the storage client received an error on retrieval';
        message += ' (' + error.message + ')';

        throw new errors.ExternalProviderError(message, CLIENT_NAME);
      });
  }

  function _handleDisabledRemoval(upload) {
    return files
      .removeFile(upload.get('key'), upload.get('bucket'))
      .then(() => upload.destroy());
  }

  function _handleRemoval(upload) {
    const params = {};
    params.Bucket = upload.get('bucket');
    params.Key = upload.get('key');

    return remote.deleteObject(params)
      .promise()
      .catch((error) => {
        let message = 'the storage client received an error on removal';
        message += ' (' + error.message + ')';

        throw new errors.ExternalProviderError(message, CLIENT_NAME);
      })
      .then(() => upload.destory());
  }

  /**
   * Finds an upload by its internal ID
   * @param  {Number} id			the internal ID of the requested upload
   * @return {Promise<Upload>}	the requested upload
   * @throws {NotFoundError}	when the upload does not exist
   */
  this.findUploadById = (id) => Upload
    .findById(id)
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'An upload with the given ID cannot be found';
        const source = 'id';
        throw new errors.NotFoundError(message, source);
      }

      return _Promise.resolve(result);
    });

  /**
   * Finds an upload by its key in a given bucket
   * @param  {String} key		the previously key given to the upload
   * @param  {String} bucket	the bucket assigned to the upload
   * @return {Promise<Upload>} the requested upload
   * @throws {NotFoundError} when the upload does not exist
   */
  this.findUploadByKey = (key, bucket) => Upload
    .findByKey(key, bucket)
    .then((result) => {
      if (_.isNull(result)) {
        const message = 'An upload with the given key does not exist in the provided bucket';
        throw new errors.NotFoundError(message);
      }

      return _Promise.resolve(result);
    });

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
  this.createUpload = (owner, params) => {
    const uploadParams = {};
    uploadParams.ownerId = owner.get('id');
    uploadParams.key = params.key || uuid4();
    uploadParams.bucket = params.bucket;

    return Upload.forge(uploadParams)
      .save();
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
  this.persistUpload = (upload, file) => {
    if (!config.aws.enabled) {
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
  this.getUpload = (upload) => {
    if (!config.aws.enabled) {
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
  this.removeUpload = (upload) => {
    if (!config.aws.enabled) {
      return _handleDisabledRemoval(upload);
    }
    return _handleRemoval(upload);
  };
}

StorageService.prototype.constructor = StorageService;

module.exports = function(ctx) {
  return new StorageService(ctx);
}
