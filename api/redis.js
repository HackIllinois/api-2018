var logger = require('./logging');
var config = require('./config');
var _Promise = require('bluebird');
var redis = require('redis');
var client = require('aws-sdk');

client.config.credentials = new client.SharedIniFileCredentials({ profile: config.profile });
client.isEnabled = !!client.config.credentials.accessKeyId;
var _remote = new client.ElastiCache();

_Promise.promisifyAll(redis.RedisClient.prototype);
_Promise.promisifyAll(redis.Multi.prototype);

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
		})
}

function CacheManager () {
	this._CONFIG = _initRedis();
	this._cache = redis.createClient(this._CONFIG);
}

CacheManager.prototype.constructor = CacheManager;

CacheManager.prototype.instance = function () {
	return this._cache;
};

logger.info("connecting to redis");

module.exports = new CacheManager();