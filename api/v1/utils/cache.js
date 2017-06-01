const client = require('../../cache').instance();
const errors = require('../errors');

module.exports.hasKey = function (key) {
  return client.existsAsync(key);
};

module.exports.expireKey = function (key, duration) {
  return client.existsAsync(key)
		.then((reply) => {
  if(reply != 1){
    throw new errors.RedisError();
  }
})
		.then(() => client.expireAsync(key, duration))
		.then((reply) => reply);
};

module.exports.getString = function (key) {
  return client.existsAsync(key)
		.then((reply) => {
  if(reply != 1){
    throw new errors.RedisError();
  }
  return null;
})
		.then(() => client.getAsync(key))
		.then((res) => res);
};

module.exports.storeString = function (key, value) {
  return client.setAsync(key, value).then((reply) => reply);
};
