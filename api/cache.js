const config = require('./config');
const logger = require('./logging');

const _Promise = require('bluebird');
const redis = require('redis');

_Promise.promisifyAll(redis.RedisClient.prototype);
if(redis.Multi) {
  _Promise.promisifyAll(redis.Multi.prototype);
}

const _REDIS_CONFIG = {
  host: config.redis.host,
  port: config.redis.port
};

function CacheManager () {
  logger.info('connecting to cache');

  this._cache = redis.createClient(_REDIS_CONFIG);
  this._cache.on('error', (err) => {
    logger.error(err);
  });
}

CacheManager.prototype.constructor = CacheManager;

CacheManager.prototype.instance = function() {
  return this._cache;
};

module.exports = new CacheManager();
