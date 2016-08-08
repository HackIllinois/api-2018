var Model = require('./Model');
var Upload = Model.extend({
	tableName: 'uploads',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated']
});

/**
 * Finds the upload with the associated key in the specified bucket
 * @param  {String} key		the key associated with the upload
 * @param  {String} bucket	the bucket in which to look
 * @return {Promise<Upload>} the requested upload, if it exists
 */
Upload.findByKey = function (key, bucket) {
	return Upload.where({ key: key, bucket: bucket }).fetchOne();
};

module.exports = Upload;
