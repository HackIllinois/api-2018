function Storage(ctx) {
  let config = ctx.config();

  this.buckets = {};
  Object.keys(config.storage.buckets)
    .forEach((key) => {
      this.buckets[key] = config.storage.buckets[key] + config.storage.bucketExtension;
    });
}

Storage.prototype.constructor = Storage;

module.exports = function(ctx) {
  return new Storage(ctx);
}
