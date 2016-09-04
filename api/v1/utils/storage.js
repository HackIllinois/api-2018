var config = require('../../config');

module.exports.buckets = {};

// the base of the buckets are given here. the extensions will be added
// automatically at the end of the exports
module.exports.buckets.resumes = 'hackillinois-resumes';

Object.keys(module.exports.buckets).forEach(function (key) {
	module.exports.buckets[key] += config.storage.bucketExtension;
});
