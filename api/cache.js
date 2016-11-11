var logger = require('./logging');
var config = require('./config');
var _Promise = require('bluebird');
var redis = require('redis');
var client = require('aws-sdk');

_Promise.promisifyAll(redis.RedisClient.prototype);
_Promise.promisifyAll(redis.Multi.prototype);

client.config.credentials = new client.SharedIniFileCredentials({ profile: config.profile });
client.isEnabled = !!client.config.credentials.accessKeyId;
var _remote = new client.ElastiCache();

function _buildConfiguration() {
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

function _instantiate(cache) {
	if(cache.connected) {
		return _Promise.resolve(cache);
	}

	return new Promise(function(resolve, reject) {
		cache.on("ready", function() {
			resolve(cache);
		});
		cache.on("error", function(err) {
			reject(err);
		});
	});
}

function CacheManager () {
	this._cache = undefined;
}

CacheManager.prototype.constructor = CacheManager;

CacheManager.prototype.instance = function() {
	if(!this._cache) {
		throw new TypeError('cache module is not initialized');
	}
	return this._cache;
}

CacheManager.prototype.instantiate = function (){
	if(!this._cache) {
		return _buildConfiguration().bind(this)
			.then(function(config) {
				this._cache = redis.createClient(config);
				return _instantiate(this._cache);
			});
	}
	return _instantiate(this._cache);
};

logger.info("connecting to redis");

module.exports = new CacheManager();