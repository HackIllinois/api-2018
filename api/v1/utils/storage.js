function Store(ctx) {
  let config = ctx.config();

  this.buckets = {};
  Object.keys(config.storage.buckets)
    .forEach((key) => {
      this.buckets[key] = config.storage.buckets[key] + config.storage.bucketExtension;
    });
}

Store.prototype.constructor = Store;

let storage;

module.exports = function(ctx) {
  if(!storage) {
    storage = new Store(ctx);
  }
  return storage;
}
