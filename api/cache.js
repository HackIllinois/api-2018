var config = require('./config');
var _Promise = require('bluebird');
var redis = require('redis');

_Promise.promisifyAll(redis.RedisClient.prototype);
_Promise.promisifyAll(redis.Multi.prototype);

_REDIS_CONFIG = {
	host: config.redis.host,
	port: config.redis.port
}

function CacheManager () {
	this._cache = redis.createClient(_REDIS_CONFIG);;
}

CacheManager.prototype.constructor = CacheManager;

CacheManager.prototype.instance = function() {
	return this._cache;
}

module.exports = new CacheManager();