var config = require('../../config');

module.exports.statuses = {};
module.exports.buckets = {};
module.exports.types = {};

module.exports.statuses.empty = 'EMPTY';
module.exports.statuses.sent = 'SENT';
module.exports.statuses.stored = 'STORED';
module.exports.statuses.dropped = 'DROPPED';

module.exports.buckets.resumes = 'hackillinois-resumes';

module.exports.types.pdf = 'application/pdf';
module.exports.types.binary = 'application/octet-stream';

module.exports.buckets.forEach(function (value, key, map) {
	map[key] = value + config.storage.bucketExtension;
});
