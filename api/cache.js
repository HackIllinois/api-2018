var logger = require('./logging');
var config = require('./config');
var _Promise = require('bluebird');
var redis = require('redis');
var client = require('aws-sdk');

client.config.credentials = new client.SharedIniFileCredentials({ profile: config.profile });
client.isEnabled = !!client.config.credentials.accessKeyId;
var _remote = new client.ElastiCache();

function _initRedis () {
	_REDIS_CONFIG = {};
	if(!client.isEnabled) {
		_REDIS_CONFIG.host = config.redis.host;
		_REDIS_CONFIG.port = config.redis.port;
		return _Promise.resolve(_REDIS_CONFIG);
	}

	return _remote.describeReplicationGroups().promise()
		.then(function (data) {
			_REDIS_CONFIG.host = data.ReplicationGroups[0].NodeGroups[0].PrimaryEndpoint.address;
			_REDIS_CONFIG.port = data.ReplicationGroups[0].NodeGroups[0].PrimaryEndpoint.port;
			return _REDIS_CONFIG;
		})
		.catch(function (err) {
			logger.error(err);
		});
}

function CacheManager () {
	_initRedis().then(function(config) {
		_Promise.promisifyAll(redis.RedisClient.prototype);
		_Promise.promisifyAll(redis.Multi.prototype);
		this._cache = redis.createClient(config);
	});
}

CacheManager.prototype.constructor = CacheManager;

CacheManager.prototype.instance = function () {
	return new Promise(function(resolve, reject) {
		var cache = this._cache;
		cache.on("ready", function() {
			resolve(cache);
		});
		cache.on("error", function(err) {
			reject(err);
		});
	});
};

logger.info("connecting to redis");

module.exports = new CacheManager();