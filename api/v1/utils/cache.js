const ctx = require('ctx');
const client = ctx.cache().instance();
const errors = require('../errors');

module.exports.hasKey = (key) => client.existsAsync(key);

module.exports.expireKey = (key, duration) => client.existsAsync(key)
    .then((reply) => {
      if (reply != 1) {
        throw new errors.RedisError();
      }
    })
    .then(() => client.expireAsync(key, duration))
    .then((reply) => reply);

module.exports.getString = (key) => client.existsAsync(key)
    .then((reply) => {
      if (reply != 1) {
        throw new errors.RedisError();
      }
      return null;
    })
    .then(() => client.getAsync(key))
    .then((res) => res);

module.exports.storeString = (key, value) => client.setAsync(key, value)
    .then((reply) => reply);
