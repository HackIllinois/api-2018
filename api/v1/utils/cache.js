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
		.then(() => {
			return client.expireAsync(key, duration);
		})
		.then((reply) => {
			return reply;
		});
};

module.exports.getString = function (key) {
	return client.existsAsync(key)
		.then((reply) => {
			if(reply != 1){
				throw new errors.RedisError();
			}
			return null;
		})
		.then(() => {
			return client.getAsync(key);
		})
		.then((res) => {
			return res;
		});
};

module.exports.storeString = function (key, value) {
	return client.setAsync(key, value).then((reply) => {
		return reply;
	});
};
