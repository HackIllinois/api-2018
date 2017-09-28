const appcontext = require('../../../appcontext');
const config = appcontext.config();

module.exports.buckets = {};

Object.keys(config.storage.buckets)
  .forEach((key) => {
    module.exports.buckets[key] += config.storage.bucketExtension;
  });
