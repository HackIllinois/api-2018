const errors = require('../errors');

function Cache(ctx) {
  let client = ctx.cache().instance();
  this.hasKey = (key) => client.existsAsync(key);

  this.expireKey = (key, duration) => client.existsAsync(key)
    .then((reply) => {
      if (reply != 1) {
        throw new errors.RedisError();
      }
    })
    .then(() => client.expireAsync(key, duration))
    .then((reply) => reply);

  this.getString = (key) => client.existsAsync(key)
    .then((reply) => {
      if (reply != 1) {
        throw new errors.RedisError();
      }
      return null;
    })
    .then(() => client.getAsync(key))
    .then((res) => res);

  this.storeString = (key, value) => client.setAsync(key, value)
    .then((reply) => reply);
}

Cache.prototype.constructor = Cache;

module.exports = function(ctx) {
  return new Cache(ctx);
}
