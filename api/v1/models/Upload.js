var Model = require('./Model');
var Upload = Model.extend({
	tableName: 'uploads',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated']
});

/**
 * Finds all uploads belonging to a given user
 * @param  {User} owner		the owner of the uploads
 * @param  {String} bucket	(optional) the bucket in which to search
 * @return {Promise<Collection<Upload>>} all of the uploads belonging to the owner
 */
Upload.findByOwner = function (owner, bucket) {
	var queryParams = { where : {} };

	queryParams.where.owner_id = owner.get('id');
	if (bucket) { queryParams.where.bucket = bucket; }

	return Upload.collection().query(queryParams).fetch();
};

/**
 * Finds the upload with the associated key in the specified bucket
 * @param  {String} key		the key associated with the upload
 * @param  {String} bucket	the bucket in which to look
 * @return {Promise<Upload>} the requested upload, if it exists
 */
Upload.findByKey = function (key, bucket) {
	return Upload.collection().query({ where: { key: key, bucket: bucket } }).fetchOne();
};

module.exports = Upload;
