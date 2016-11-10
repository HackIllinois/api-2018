var _Promise = require('bluebird');

var config = require('../../config');
var files = require('../../files');
var errors = require('../errors');
var Upload = require('../models/Upload');
var cache = require('../../cache');


var client = cache.instance().then(function(client) {
	return client;
});


module.exports.storeHash = function (key, keyValuePairs) {
	return client.hmsetAsync(key, keyValuePairs).then(function(reply){
		return reply;
	});
}

module.exports.storeString = function (key, value) {
	return client.setAsync(key, value).then(function(reply){
		return reply;
	});
}

module.exports.storeList = function (key, values) {
	return client.rpushAsync(key, values).then(function(reply){
		return reply;
	});
}

module.exports.updateHash = function (key, field, newVal) {
	return client.existsAsync(key)
		.then(function(reply){
			if(reply != 1){
				throw new errors.RedisError();
			}
			return null;
		})
		.then(function(){
			return client.hsetAsync(key, field, newVal);
		})
		.then(function(reply){
			return reply;
		});
}

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
}

module.exports.getList = function (key, startIndex, endIndex) {
	return client.existsAsync(key)
		.then(function(reply){
			if(reply != 1){
				throw new errors.RedisError();
			}
			return null;
		})
		.then(function(){
			return client.lrangeAsync(key, startIndex, endIndex);
		})
		.then(function(res){
			return res;
		});
} 

module.exports.getHash = function (key) {
	return client.existsAsync(key)
		.then(function(reply){
			if(reply != 1){
				throw new errors.RedisError();
			}
			return null;
		})
		.then(function(){
			return client.hgetallAsync(key);
		})
		.then(function(object){
			return object;
		});
}

module.exports.getHashField = function (key, field) {
	return client.hexistsAsync(key, field)
		.then(function(reply){
			if(reply != 1){
				throw new errors.RedisError();
			}
			return null;
		})
		.then(function(){
			return client.hgetAsync(key, field);
		})
		.then(function(reply){
			return reply;
		});
}

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
}