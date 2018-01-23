const ctx = require('ctx');
const config = ctx.config();

module.exports.buckets = {};

Object.keys(config.storage.buckets)
  .forEach((key) => {
    module.exports.buckets[key] = config.storage.buckets[key] + config.storage.bucketExtension;
  });
