var client = require('../../cache').instance();

module.exports.hasKey = function (key) {
	return client.existsAsync(key);
};

module.exports.expireKey = function (key, duration) {
	return client.existsAsync(key)
		.then(function(reply){
			if(reply != 1){
				throw new errors.RedisError();
			}
		})
		.then(function(){
			return client.expireAsync(key, duration);
		})
		.then(function(reply){
			return reply;
		});
};

module.exports.getString = function (key) {
	return client.existsAsync(key)
		.then(function(reply){
			if(reply != 1){
				throw new errors.RedisError();
			}
			return null;
		})
		.then(function(){
			return client.getAsync(key);
		})
		.then(function(res){
			return res;
		});
};

module.exports.storeString = function (key, value) {
	return client.setAsync(key, value).then(function(reply){
		return reply;
	});
};
