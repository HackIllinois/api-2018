var config = require('../../config');
var files = require('../../files');

var client = require('aws-sdk');
var type = require('file-type');
var _ = require('lodash');

client.config.credentials = new client.SharedIniFileCredentials({ profile: config.profile });
client.isEnabled = !!client.config.accessKeyId;

/**
 * Uploads a file stream to storage
 * @param  {User} owner				the owner of the content
 * @param  {Buffer} content			buffer holding the content
 * @param  {String} bucket			the bucket in which to store the content
 * @param  {Number} maxLength		(optional) the max length of the buffer, defaulting to the configured max
 * @param  {Array} dispositions		(optional) a list of allowed file types, defaulting to any
 * @return {Promise<Upload>}		a promise resolving to the internal upload representation
 * @throws {ExternalProviderError} 	when the client throws an error
 */
function upload(owner, content, bucket, maxLength, dispositions) {

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
