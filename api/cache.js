var config = require('./config');
var logger = require('./logging');

var _Promise = require('bluebird');
var redis = require('redis');

_Promise.promisifyAll(redis.RedisClient.prototype);
if(!config.isTest) {
	_Promise.promisifyAll(redis.Multi.prototype);
}
_REDIS_CONFIG = {
	host: config.redis.host,
	port: config.redis.port
}

function CacheManager () {
	logger.info("connecting to redis");
	this._cache = redis.createClient(_REDIS_CONFIG);;
}

CacheManager.prototype.constructor = CacheManager;

CacheManager.prototype.instance = function() {
	return this._cache;
}

module.exports = new CacheManager();